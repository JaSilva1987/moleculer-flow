'use strict';
import {
	Context,
	Errors,
	Service as MoleculerService,
	ServiceBroker,
	ServiceSchema
} from 'moleculer';
import { Action, Service } from 'moleculer-decorators';
import { IProductsBoxifarma } from '../../../src/interface/boxifarma/product/productsBoxifarma.interface';
import { apmElasticConnect, loggerElastic } from '../../library/elasticSearch';
@Service({
	name: 'boxifarma.products',
	group: 'flow-boxifarma'
})
export default class ProductsBoxifarmaServices extends MoleculerService {
	responseFuncional: object;
	indexName = 'flow-boxifarma-products';
	isCode = '200';
	originLayer = 'boxifarma';
	serviceName = 'ProductsBoxifarmaService';
	responseApi: any | object;
	returnBox: object;
	public constructor(public broker: ServiceBroker, schema: ServiceSchema) {
		super(broker);
	}
	@Action({
		cache: false,
		rest: {
			method: 'GET',
			basePath: 'products/',
			path: 'boxifarma/'
		},
		params: {
			codigoEAN: 'string',
			tenantId: 'string',
			branchId: 'string'
		},
		name: 'boxifarma.products',
		group: 'flow-boxifarma'
	})
	public async ProductsGet(ctxMessage: Context<IProductsBoxifarma>) {
		try {
			this.responseApi = await this.broker.emit(
				'boxifarma.integration.get.products',
				ctxMessage.params
			);
			this.responseApi.forEach((boxReturn: Array<object>) => {
				boxReturn.forEach((boxRet: object) => {
					this.returnBox = {
						viveo: {
							products: boxRet
						}
					};
				});
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
