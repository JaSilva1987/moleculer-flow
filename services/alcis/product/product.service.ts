'use strict';

import * as dotenv from 'dotenv';
import {
	Service as MoleculerService,
	ServiceBroker,
	ServiceSchema
} from 'moleculer';
import { Action, Service } from 'moleculer-decorators';
import { alcisRequestController } from '../../../src/controller/alcis/services/alcisRequest.controller';
import { IProductData } from '../../../src/interface/alcis/products/products.interface';
import { apmElasticConnect, loggerElastic } from '../../library/elasticSearch';

dotenv.config();
@Service({
	name: 'alcis-product',
	group: 'flow-alcis'
})
export default class productData extends MoleculerService {
	public constructor(public broker: ServiceBroker, schema: ServiceSchema) {
		super(broker);
	}

	public indexName = 'flow-alcis-product';
	public serviceName = 'product.service';
	public originLayer = 'alcis';

	private productUrl =
		process.env.ALCIS_BASE_URL + process.env.ALCIS_PRODUCT_URL;

	public async started() {}
	@Action({
		cache: false,
		rest: 'GET products/',
		name: 'service.alcis.get-products',
		group: 'flow-alcis'
	})
	public async getProducts(context: any) {
		apmElasticConnect.startTransaction(
			'IA Version 1 => ALCIS - GET Products',
			'request'
		);
		let getProductsParams = context.params;
		console.log('PRODUCT GET', getProductsParams?.id);

		loggerElastic(
			this.indexName,
			'200',
			this.originLayer,
			this.serviceName,
			JSON.stringify(`get - ${this.productUrl}`),
			JSON.stringify(getProductsParams)
		);

		try {
			const getProductsResponse = await alcisRequestController(
				this.productUrl,
				null,
				'Authorization',
				'get',
				null,
				null,
				null,
				null,
				getProductsParams
			);

			if (getProductsResponse instanceof Error) {
				throw getProductsResponse;
			}

			context.meta.$statusCode = getProductsResponse.status;

			loggerElastic(
				this.indexName,
				String(getProductsResponse.status),
				this.originLayer,
				this.serviceName,
				JSON.stringify(`get - ${this.productUrl}`),
				JSON.stringify(getProductsResponse)
			);

			apmElasticConnect.endTransaction([this.productUrl]);
			return getProductsResponse.message;
		} catch (error) {
			const errorStatus = error?.status || error?.code || 400;

			loggerElastic(
				this.indexName,
				String(errorStatus),
				this.originLayer,
				this.serviceName,
				JSON.stringify(`get - ${this.productUrl}`),
				JSON.stringify(error)
			);

			context.meta.$statusCode = +errorStatus;

			apmElasticConnect.endTransaction([this.productUrl]);
			return error;
		}
	}

	@Action({
		cache: false,
		rest: 'POST products/',
		name: 'service.alcis.post-new-product',
		group: 'flow-alcis'
	})
	public async postProduct(context: any) {
		apmElasticConnect.startTransaction(
			'IA Version 1 => ALCIS - POST Products',
			'request'
		);
		const postBody: IProductData = context.params;
		console.log('PRODUCT POST', postBody);

		loggerElastic(
			this.indexName,
			'200',
			this.originLayer,
			this.serviceName,
			JSON.stringify(`post - ${this.productUrl}`),
			JSON.stringify(postBody)
		);

		try {
			const postResponse = await alcisRequestController(
				this.productUrl,
				postBody,
				'Authorization',
				'post',
				null,
				null
			);

			if (postResponse instanceof Error) {
				throw postResponse;
			}

			context.meta.$statusCode = postResponse.status;

			loggerElastic(
				this.indexName,
				String(postResponse.status),
				this.originLayer,
				this.serviceName,
				JSON.stringify(`post - ${JSON.stringify(postBody)}`),
				JSON.stringify(postResponse)
			);

			apmElasticConnect.endTransaction([this.productUrl]);
			return postResponse.message;
		} catch (error) {
			const errorStatus = error?.status || error?.code || 400;

			loggerElastic(
				this.indexName,
				String(errorStatus),
				this.originLayer,
				this.serviceName,
				JSON.stringify(`post - ${JSON.stringify(postBody)}`),
				JSON.stringify(error)
			);

			context.meta.$statusCode = +errorStatus;

			apmElasticConnect.endTransaction([this.productUrl]);
			return error;
		}
	}

	@Action({
		cache: false,
		rest: 'PUT products/',
		name: 'service.alcis.put-product',
		group: 'flow-alcis'
	})
	public async putProduct(context: any) {
		apmElasticConnect.startTransaction(
			'IA Version 1 => ALCIS - PUT Products',
			'request'
		);
		const putBody: IProductData = context.params;

		loggerElastic(
			this.indexName,
			'200',
			this.originLayer,
			this.serviceName,
			JSON.stringify(`put - ${this.productUrl}`),
			JSON.stringify(putBody)
		);

		try {
			const putResponse = await alcisRequestController(
				this.productUrl,
				putBody,
				'Authorization',
				'put',
				null,
				null
			);

			if (putResponse instanceof Error) {
				throw putResponse;
			}

			context.meta.$statusCode = putResponse.status;

			loggerElastic(
				this.indexName,
				String(putResponse.status),
				this.originLayer,
				this.serviceName,
				JSON.stringify(`put - ${JSON.stringify(putBody)}`),
				JSON.stringify(putResponse)
			);

			apmElasticConnect.endTransaction([this.productUrl]);
			return putResponse.message;
		} catch (error) {
			const errorStatus = error?.status || error?.code || 400;

			loggerElastic(
				this.indexName,
				String(errorStatus),
				this.originLayer,
				this.serviceName,
				JSON.stringify(`putBody - ${JSON.stringify(putBody)}`),
				JSON.stringify(error)
			);

			context.meta.$statusCode = +errorStatus;

			apmElasticConnect.endTransaction([this.productUrl]);
			return error;
		}
	}
}
