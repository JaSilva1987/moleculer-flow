'use strict';
import * as dotenv from 'dotenv';
import {
	Errors,
	Service as MoleculerService,
	ServiceBroker,
	ServiceSchema
} from 'moleculer';
import { Event, Service } from 'moleculer-decorators';
import { IProductsBoxifarma } from '../../../../src/interface/boxifarma/product/productsBoxifarma.interface';
import { AxiosRequest } from '../../../library/axios';
import {
	loggerElastic,
	apmElasticConnect
} from '../../../library/elasticSearch';

dotenv.config();

@Service({
	name: 'boxifarma.erpprotheusmafra.products',
	group: 'flow-boxifarma'
})
export default class ProductsBoxifarmaServices extends MoleculerService {
	indexName = 'flow-boxifarma-products';
	isCode = '200';
	originLayer = 'erpprotheusviveo';
	serviceName = 'ProductsBoxiFarmaService';

	public constructor(public broker: ServiceBroker, schema: ServiceSchema) {
		super(broker);
	}

	@Event({
		name: 'boxifarma.erpprotheusmafra.get.products',
		group: 'flow-boxifarma'
	})
	public async ProductsGet(ctxMessage: IProductsBoxifarma) {
		try {
			const requestObj = {
				method: 'get',
				url:
					process.env.URL_PROTHEUS_BOXIFARMA +
					'VVESTW01?cCodigoEAN=' +
					ctxMessage.codigoEAN +
					'&cEmpresa=' +
					ctxMessage.tenantId +
					'&cFilialEmp=' +
					ctxMessage.branchId +
					'&cParToken=' +
					process.env.BOXIFARMA_TOKEN,
				headers: {
					['Authorization']: `Basic ${process.env.BOXIFARMA_BASIC}`
				}
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
