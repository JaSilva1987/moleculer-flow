'use strict';
import {
	Errors,
	Service as MoleculerService,
	ServiceBroker,
	ServiceSchema
} from 'moleculer';
import { Event, Service } from 'moleculer-decorators';
import { IProductsBoxifarma } from '../../../src/interface/boxifarma/product/productsBoxifarma.interface';
import { apmElasticConnect, loggerElastic } from '../../library/elasticSearch';

@Service({
	name: 'boxifarma.integration.products',
	group: 'flow-boxifarma'
})
export default class ProductsBoxifarmaServices extends MoleculerService {
	indexName = 'flow-boxifarma-products';
	isCode = '200';
	originLayer = 'integration';
	serviceName = 'ProductsBoxifarmaService';
	responseApi: any | object;
	returnBox: Array<object>;

	public constructor(public broker: ServiceBroker, schema: ServiceSchema) {
		super(broker);
	}

	@Event({
		name: 'boxifarma.integration.get.products',
		group: 'flow-boxifarma'
	})
	public async productsBoxifarmaIntermediary(ctxMessage: IProductsBoxifarma) {
		try {
			this.responseApi = await this.broker.emit(
				'boxifarma.erpprotheusmafra.get.products',
				ctxMessage
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

			return this.responseApi;
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
