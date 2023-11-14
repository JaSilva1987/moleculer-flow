('use strict');

import { Service as MoleculerService, ServiceBroker } from 'moleculer';
import { Event, Service } from 'moleculer-decorators';
import { IInventoryCte } from '../../../src/interface/cte/inventory/inventoryCte.interface';
import { apmElasticConnect, loggerElastic } from '../../library/elasticSearch';

@Service({
	name: 'cte.integration.inventory',
	group: 'flow-cte'
})
export default class InventoryService extends MoleculerService {
	responseApi: any | Array<object>;
	returnResponse: object;
	indexName = 'flow-cte';
	isCode = '200';
	originLayer = 'integration';
	serviceName = 'InventoryService';

	public constructor(public broker: ServiceBroker) {
		super(broker);
	}

	@Event({
		name: 'cte.integration.get.inventory',
		group: 'flow-cte'
	})
	public async GetInventoryCte(ctxInventory: IInventoryCte) {
		try {
			const emitMessage = ctxInventory;
			this.responseApi = await this.broker.emit(
				'cte.erpprotheusviveo.get.inventory',
				emitMessage
			);

			loggerElastic(
				this.indexName,
				this.isCode,
				this.originLayer,
				this.serviceName,
				JSON.stringify(ctxInventory),
				JSON.stringify(this.responseApi)
			);

			this.responseApi.forEach((respRoute: object) => {
				this.returnResponse = respRoute;
			});

			loggerElastic(
				this.indexName,
				this.isCode,
				this.originLayer,
				this.serviceName,
				JSON.stringify(ctxInventory),
				JSON.stringify(this.returnResponse)
			);

			return this.returnResponse;
		} catch (error) {
			loggerElastic(
				this.indexName,
				'499',
				this.originLayer,
				this.serviceName,
				JSON.stringify(ctxInventory),
				JSON.stringify(error.message)
			);

			apmElasticConnect
				.setTransactionName(this.indexName)
				.captureError(new Error(error.message))
				.endTransaction([error]);
		}
	}
}
