'use strict';
import * as dotenv from 'dotenv';
import {
	Errors,
	Service as MoleculerService,
	ServiceBroker,
	ServiceSchema
} from 'moleculer';
import { Event, Service } from 'moleculer-decorators';
import { IIOrdersBoxifarma } from '../../../../src/interface/boxifarma/order/ordersBoxifarma.inteface';
import { AxiosRequest } from '../../../library/axios';
import {
	loggerElastic,
	apmElasticConnect
} from '../../../library/elasticSearch';

dotenv.config();

@Service({
	name: 'boxifarma.erpprotheusmafra.orders',
	group: 'flow-boxifarma'
})
export default class OrdersBoxifarmaServices extends MoleculerService {
	indexName = 'flow-boxifarma-orders';
	isCode = '200';
	originLayer = 'erpprotheusviveo';
	serviceName = 'OrdersBoxiFarmaService';

	public constructor(public broker: ServiceBroker, schema: ServiceSchema) {
		super(broker);
	}

	@Event({
		name: 'boxifarma.erpprotheusmafra.post.orders',
		group: 'flow-boxifarma'
	})
	public async OrdersPost(ctxMessage: IIOrdersBoxifarma) {
		try {
			const requestObj = {
				method: 'post',
				url:
					process.env.URL_PROTHEUS_BOXIFARMA +
					'VVLOJW01?cEmpresa=' +
					ctxMessage.tenantId +
					'&cFilialEmp=' +
					ctxMessage.branchId +
					'&cParToken=' +
					process.env.BOXIFARMA_TOKEN,
				headers: {
					['Authorization']: `Basic ${process.env.BOXIFARMA_BASIC}`
				},
				data: ctxMessage.bodyData
			};

			const requestProtheus = await AxiosRequest(requestObj);

			loggerElastic(
				this.indexName,
				this.isCode,
				this.originLayer,
				this.serviceName,
				JSON.stringify(ctxMessage),
				JSON.stringify(requestProtheus)
			);

			return requestProtheus;
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
