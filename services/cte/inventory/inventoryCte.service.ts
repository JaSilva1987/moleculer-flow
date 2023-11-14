('use strict');

import {
	Context,
	Errors,
	Service as MoleculerService,
	ServiceBroker
} from 'moleculer';
import { IInventoryCte } from '../../../src/interface/cte/inventory/inventoryCte.interface';
import { apmElasticConnect, loggerElastic } from '../../library/elasticSearch';

export default class InventoryCteService extends MoleculerService {
	indexName = 'flow-cte';
	isCode = '200';
	originLayer = 'cte';
	serviceName = 'InventoryCteService';

	public constructor(public broker: ServiceBroker) {
		super(broker);
		this.parseServiceSchema({
			name: 'cte-inventory',
			group: 'flow-cte',
			actions: {
				get: {
					cache: false,
					rest: {
						method: 'GET',
						basePath: 'cte/',
						path: 'inventory/'
					},
					async handler(
						ctxMessage: Context<object>
					): Promise<IInventoryCte> {
						return await this.InventoryGet(ctxMessage);
					}
				}
			}
		});
	}

	public async InventoryGet(ctxInventory: Context<IInventoryCte>) {
		try {
			this.responseApi = await this.broker.emit(
				'cte.integration.get.inventory',
				ctxInventory.params
			);
			this.responseApi.forEach((returnResponse: IInventoryCte) => {
				this.returnResponse = returnResponse.message;
			});

			loggerElastic(
				this.indexName,
				this.isCode,
				this.originLayer,
				this.serviceName,
				JSON.stringify(ctxInventory.params),
				JSON.stringify(this.responseApi)
			);
			return this.returnResponse;
		} catch (error) {
			loggerElastic(
				this.indexName,
				error.code,
				this.originLayer,
				this.serviceName,
				JSON.stringify(ctxInventory.params),
				JSON.stringify(error.message)
			);
			apmElasticConnect.captureError(new Error(error.message));
			throw new Errors.MoleculerError(error.message, error.code);
		}
	}
}
