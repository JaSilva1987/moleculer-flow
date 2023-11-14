'use strict';

import * as dotenv from 'dotenv';
import {
	Service as MoleculerService,
	ServiceBroker,
	ServiceSchema
} from 'moleculer';
import { Action, Service } from 'moleculer-decorators';
import { alcisRequestController } from '../../../src/controller/alcis/services/alcisRequest.controller';
import { IShippingCompanyData } from '../../../src/interface/alcis/shippingCompany/shippingCompany.interface';
import { apmElasticConnect, loggerElastic } from '../../library/elasticSearch';

dotenv.config();
@Service({
	name: 'alcis-shipping-company',
	group: 'flow-alcis'
})
export default class shippingCompanyData extends MoleculerService {
	public constructor(public broker: ServiceBroker, schema: ServiceSchema) {
		super(broker);
	}

	public indexName = 'flow-alcis-shipping-company';
	public serviceName = 'shipping-company.service';
	public originLayer = 'alcis';

	private shippingCompanyUrl =
		process.env.ALCIS_BASE_URL + process.env.ALCIS_SHIPPING_COMPANY_URL;

	public async started() {}
	@Action({
		cache: false,
		rest: 'GET shipping-company/',
		name: 'service.alcis.get-shipping-company',
		group: 'flow-alcis'
	})
	public async getShippingCompany(context: any) {
		apmElasticConnect.startTransaction(
			'IA Version 1 => ALCIS - GET Shipping Company',
			'request'
		);
		let getShippingCompanyParams = context.params;

		loggerElastic(
			this.indexName,
			'200',
			this.originLayer,
			this.serviceName,
			JSON.stringify(`get - ${this.shippingCompanyUrl}`),
			JSON.stringify(getShippingCompanyParams)
		);

		try {
			const getShippingCompanyResponse = await alcisRequestController(
				this.shippingCompanyUrl,
				null,
				'Authorization',
				'get',
				null,
				null,
				null,
				null,
				getShippingCompanyParams
			);

			if (getShippingCompanyResponse instanceof Error) {
				throw getShippingCompanyResponse;
			}

			context.meta.$statusCode = getShippingCompanyResponse.status;

			loggerElastic(
				this.indexName,
				String(getShippingCompanyResponse.status),
				this.originLayer,
				this.serviceName,
				JSON.stringify(`get - ${this.shippingCompanyUrl}`),
				JSON.stringify(getShippingCompanyResponse)
			);

			apmElasticConnect.endTransaction([this.shippingCompanyUrl]);
			return getShippingCompanyResponse.message;
		} catch (error) {
			const errorStatus = error?.status || error?.code || 400;

			loggerElastic(
				this.indexName,
				String(errorStatus),
				this.originLayer,
				this.serviceName,
				JSON.stringify(`get - ${this.shippingCompanyUrl}`),
				JSON.stringify(error)
			);

			context.meta.$statusCode = +errorStatus;

			apmElasticConnect.endTransaction([this.shippingCompanyUrl]);
			return error;
		}
	}

	@Action({
		cache: false,
		rest: 'POST shipping-company/',
		name: 'service.alcis.post-new-shipping-company',
		group: 'flow-alcis'
	})
	public async postShippingCompany(context: any) {
		apmElasticConnect.startTransaction(
			'IA Version 1 => ALCIS - POST Shipping Company',
			'request'
		);
		const postBody: IShippingCompanyData = context.params;

		loggerElastic(
			this.indexName,
			'200',
			this.originLayer,
			this.serviceName,
			JSON.stringify(`post - ${this.shippingCompanyUrl}`),
			JSON.stringify(postBody)
		);

		try {
			const postResponse = await alcisRequestController(
				this.shippingCompanyUrl,
				postBody,
				'Authorization',
				'post'
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

			apmElasticConnect.endTransaction([this.shippingCompanyUrl]);
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

			apmElasticConnect.endTransaction([this.shippingCompanyUrl]);
			return error;
		}
	}

	@Action({
		cache: false,
		rest: 'PUT shipping-company/',
		name: 'service.alcis.put-shipping-company',
		group: 'flow-alcis'
	})
	public async putShippingCompany(context: any) {
		apmElasticConnect.startTransaction(
			'IA Version 1 => ALCIS - PUT Shipping Company',
			'request'
		);
		const putBody: IShippingCompanyData = context.params;

		loggerElastic(
			this.indexName,
			'200',
			this.originLayer,
			this.serviceName,
			JSON.stringify(`put - ${this.shippingCompanyUrl}`),
			JSON.stringify(putBody)
		);

		try {
			const putResponse = await alcisRequestController(
				this.shippingCompanyUrl,
				putBody,
				'Authorization',
				'put'
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

			apmElasticConnect.endTransaction([this.shippingCompanyUrl]);
			return putResponse.message;
		} catch (error) {
			const errorStatus = error?.status || error?.code || 400;

			loggerElastic(
				this.indexName,
				String(errorStatus),
				this.originLayer,
				this.serviceName,
				JSON.stringify(`put - ${JSON.stringify(putBody)}`),
				JSON.stringify(error)
			);

			context.meta.$statusCode = +errorStatus;

			apmElasticConnect.endTransaction([this.shippingCompanyUrl]);
			return error;
		}
	}
}
