'use strict';

import * as dotenv from 'dotenv';
import {
	Service as MoleculerService,
	ServiceBroker,
	ServiceSchema
} from 'moleculer';
import { Action, Service } from 'moleculer-decorators';
import { alcisRequestController } from '../../../src/controller/alcis/services/alcisRequest.controller';
import { IProviderData } from '../../../src/interface/alcis/provider/providers.interface';
import { apmElasticConnect, loggerElastic } from '../../library/elasticSearch';

dotenv.config();
@Service({
	name: 'alcis-provider',
	group: 'flow-alcis'
})
export default class providerData extends MoleculerService {
	public constructor(public broker: ServiceBroker, schema: ServiceSchema) {
		super(broker);
	}

	public indexName = 'flow-alcis-provider';
	public serviceName = 'provider.service';
	public originLayer = 'alcis';

	private providerUrl =
		process.env.ALCIS_BASE_URL + process.env.ALCIS_PROVIDER_URL;

	public async started() {}
	@Action({
		cache: false,
		rest: 'GET providers/',
		name: 'service.alcis.get-providers',
		group: 'flow-alcis'
	})
	public async getProviders(context: any) {
		apmElasticConnect.startTransaction(
			'IA Version 1 => ALCIS - GET Providers',
			'request'
		);
		let getProvidersParams = context.params;

		loggerElastic(
			this.indexName,
			'200',
			this.originLayer,
			this.serviceName,
			JSON.stringify(`get - ${this.providerUrl}`),
			JSON.stringify(getProvidersParams)
		);

		try {
			const getProvidersResponse = await alcisRequestController(
				this.providerUrl,
				null,
				'Authorization',
				'get',
				null,
				null,
				null,
				null,
				getProvidersParams
			);

			if (getProvidersResponse instanceof Error) {
				throw getProvidersResponse;
			}

			context.meta.$statusCode = getProvidersResponse.status;

			loggerElastic(
				this.indexName,
				String(getProvidersResponse.status),
				this.originLayer,
				this.serviceName,
				JSON.stringify(`get - ${this.providerUrl}`),
				JSON.stringify(getProvidersResponse)
			);

			apmElasticConnect.endTransaction([this.providerUrl]);
			return getProvidersResponse.message;
		} catch (error) {
			const errorStatus = error?.status || error?.code || 400;

			loggerElastic(
				this.indexName,
				String(errorStatus),
				this.originLayer,
				this.serviceName,
				JSON.stringify(`get - ${this.providerUrl}`),
				JSON.stringify(error)
			);

			context.meta.$statusCode = +errorStatus;

			apmElasticConnect.endTransaction([this.providerUrl]);
			return error;
		}
	}

	@Action({
		cache: false,
		rest: 'POST providers/',
		name: 'service.alcis.post-new-provider',
		group: 'flow-alcis'
	})
	public async postProvider(context: any) {
		apmElasticConnect.startTransaction(
			'IA Version 1 => ALCIS - POST Providers',
			'request'
		);
		const postBody: IProviderData = context.params;

		loggerElastic(
			this.indexName,
			'200',
			this.originLayer,
			this.serviceName,
			JSON.stringify(`post - ${this.providerUrl}`),
			JSON.stringify(postBody)
		);

		try {
			const postResponse = await alcisRequestController(
				this.providerUrl,
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

			apmElasticConnect.endTransaction([this.providerUrl]);
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

			apmElasticConnect.endTransaction([this.providerUrl]);
			return error;
		}
	}

	@Action({
		cache: false,
		rest: 'PUT providers/',
		name: 'service.alcis.put-provider',
		group: 'flow-alcis'
	})
	public async putProvider(context: any) {
		apmElasticConnect.startTransaction(
			'IA Version 1 => ALCIS - PUT Providers',
			'request'
		);
		const putBody: IProviderData = context.params;

		loggerElastic(
			this.indexName,
			'200',
			this.originLayer,
			this.serviceName,
			JSON.stringify(`put - ${this.providerUrl}`),
			JSON.stringify(putBody)
		);

		try {
			const putResponse = await alcisRequestController(
				this.providerUrl,
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

			apmElasticConnect.endTransaction([this.providerUrl]);
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

			apmElasticConnect.endTransaction([this.providerUrl]);
			return error;
		}
	}
}
