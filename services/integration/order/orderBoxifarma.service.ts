'use strict';
import {
	Errors,
	Service as MoleculerService,
	ServiceBroker,
	ServiceSchema
} from 'moleculer';
import { Event, Service } from 'moleculer-decorators';
import {
	IIOrdersBoxifarma,
	IOrdersBoxifarma
} from '../../../src/interface/boxifarma/order/ordersBoxifarma.inteface';
import { apmElasticConnect, loggerElastic } from '../../library/elasticSearch';

@Service({
	name: 'boxifarma.integration.orders',
	group: 'flow-boxifarma'
})
export default class OrdersBoxifarmaServices extends MoleculerService {
	indexName = 'flow-boxifarma-orders';
	isCode = '200';
	originLayer = 'integration';
	serviceName = 'OrdersBoxifarmaService';
	responseApi: any | object;
	returnBox: Array<object>;

	public constructor(public broker: ServiceBroker, schema: ServiceSchema) {
		super(broker);
	}

	@Event({
		name: 'boxifarma.integration.post.orders',
		group: 'flow-boxifarma'
	})
	public async ordersBoxifarmaIntermediary(ctxMessage: IOrdersBoxifarma) {
		try {
			const ObjtProtheus: IIOrdersBoxifarma = {
				tenantId: ctxMessage.tenantId,
				branchId: ctxMessage.branchId,
				bodyData: {
					CLIENTE: ctxMessage.CLIENTE,
					PAGADOR: ctxMessage.PAGADOR,
					RESIDENCIAL: ctxMessage.RESIDENCIAL,
					ORCAMENTO: ctxMessage.ORCAMENTO,
					PARCELAS: ctxMessage.PARCELAS,
					ITENS: ctxMessage.ITENS
				}
			};

			this.responseApi = await this.broker.emit(
				'boxifarma.erpprotheusmafra.post.orders',
				ObjtProtheus
			);

			this.responseApi.forEach((boxReturn: Array<object>) => {
				this.returnBox = boxReturn;
			});

			loggerElastic(
				this.indexName,
				this.isCode,
				this.originLayer,
				this.serviceName,
				JSON.stringify(ctxMessage),
				JSON.stringify(this.responseApi)
			);

			return this.returnBox;
		} catch (error) {
			loggerElastic(
				this.indexName,
				error.code,
				this.originLayer,
				this.serviceName,
				JSON.stringify(ctxMessage),
				JSON.stringify(error.message)
			);
			apmElasticConnect.captureError(new Error(error.message));
			throw new Errors.MoleculerError(error.message, error.code);
		}
	}
}
