'use strict';
import {
	Context,
	Errors,
	Service as MoleculerService,
	ServiceBroker,
	ServiceSchema
} from 'moleculer';
import { Action, Service } from 'moleculer-decorators';
import { IOrdersBoxifarma } from '../../../src/interface/boxifarma/order/ordersBoxifarma.inteface';
import { apmElasticConnect, loggerElastic } from '../../library/elasticSearch';

@Service({
	name: 'boxifarma.orders',
	group: 'flow-boxifarma'
})
export default class OrdersBoxifarmaServices extends MoleculerService {
	indexName = 'flow-boxifarma-orders';
	isCode = '200';
	originLayer = 'boxifarma';
	serviceName = 'OrdersBoxifarmaService';
	responseApi: any | object;
	returnBox: object;

	public constructor(public broker: ServiceBroker, schema: ServiceSchema) {
		super(broker);
	}

	@Action({
		cache: false,
		rest: {
			method: 'POST',
			basePath: 'orders/',
			path: 'boxifarma/'
		},
		params: {
			tenantId: 'string',
			branchId: 'string'
		},
		name: 'boxifarma.orders',
		group: 'flow-boxifarma'
	})
	public async OrdersPost(ctxMessage: Context<IOrdersBoxifarma>) {
		try {
			this.responseApi = await this.broker.emit(
				'boxifarma.integration.post.orders',
				ctxMessage.params
			);

			this.responseApi.forEach((boxReturn: object) => {
				this.returnBox = {
					viveo: {
						orders: boxReturn
					}
				};
			});

			loggerElastic(
				this.indexName,
				this.isCode,
				this.originLayer,
				this.serviceName,
				JSON.stringify(ctxMessage.params),
				JSON.stringify(this.responseApi)
			);
			return this.returnBox;
		} catch (error) {
			loggerElastic(
				this.indexName,
				error.code,
				this.originLayer,
				this.serviceName,
				JSON.stringify(ctxMessage.params),
				JSON.stringify(error.message)
			);
			apmElasticConnect.captureError(new Error(error.message));
			throw new Errors.MoleculerError(error.message, error.code);
		}
	}
}
