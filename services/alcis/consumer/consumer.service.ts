'use strict';

import * as dotenv from 'dotenv';
import {
	Service as MoleculerService,
	ServiceBroker,
	ServiceSchema
} from 'moleculer';
import { Action, Service } from 'moleculer-decorators';
import { alcisRequestController } from '../../../src/controller/alcis/services/alcisRequest.controller';
import { IConsumerData } from '../../../src/interface/alcis/consumer/consumer.interface';
import { apmElasticConnect, loggerElastic } from '../../library/elasticSearch';

dotenv.config();
@Service({
	name: 'alcis-consumer',
	group: 'flow-alcis'
})
export default class consumerData extends MoleculerService {
	public constructor(public broker: ServiceBroker, schema: ServiceSchema) {
		super(broker);
	}

	public indexName = 'flow-alcis-consumer';
	public serviceName = 'consumer.service';
	public originLayer = 'alcis';
	private consumerUrl =
		process.env.ALCIS_BASE_URL + process.env.ALCIS_CONSUMER_URL;

	public async started() {}
	@Action({
		cache: false,
		rest: 'GET consumer/',
		name: 'service.alcis.get-consumer',
		group: 'flow-alcis'
	})
	public async getConsumer(context: any) {
		apmElasticConnect.startTransaction(
			'IA Version 1 => ALCIS - GET Consumer',
			'request'
		);
		let getConsumerParams = context.params;

		loggerElastic(
			this.indexName,
			'200',
			this.originLayer,
			this.serviceName,
			JSON.stringify(`get - ${this.consumerUrl}`),
			JSON.stringify(getConsumerParams)
		);

		try {
			const getConsumerResponse = await alcisRequestController(
				this.consumerUrl,
				null,
				'Authorization',
				'get',
				null,
				null,
				null,
				null,
				getConsumerParams
			);

			if (getConsumerResponse instanceof Error) {
				throw getConsumerResponse;
			}

			context.meta.$statusCode = getConsumerResponse.status;

			loggerElastic(
				this.indexName,
				String(getConsumerResponse.status),
				this.originLayer,
				this.serviceName,
				JSON.stringify(`get - ${this.consumerUrl}`),
				JSON.stringify(getConsumerResponse)
			);

			apmElasticConnect.endTransaction([this.consumerUrl]);
			return getConsumerResponse.message;
		} catch (error) {
			const errorStatus = error?.status || error?.code || 400;

			loggerElastic(
				this.indexName,
				String(errorStatus),
				this.originLayer,
				this.serviceName,
				JSON.stringify(`get - ${this.consumerUrl}`),
				JSON.stringify(error)
			);

			context.meta.$statusCode = +errorStatus;

			apmElasticConnect.endTransaction([this.consumerUrl]);
			return error;
		}
	}

	@Action({
		cache: false,
		rest: 'POST consumer/',
		name: 'service.alcis.post-new-consumer',
		group: 'flow-alcis'
	})
	public async postConsumer(context: any) {
		apmElasticConnect.startTransaction(
			'IA Version 1 => ALCIS - POST Consumer',
			'request'
		);
		const postBody: IConsumerData = context.params;

		loggerElastic(
			this.indexName,
			'200',
			this.originLayer,
			this.serviceName,
			JSON.stringify(`post - ${this.consumerUrl}`),
			JSON.stringify(postBody)
		);

		try {
			const postResponse = await alcisRequestController(
				this.consumerUrl,
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
				JSON.stringify(postResponse.message)
			);

			apmElasticConnect.endTransaction([this.consumerUrl]);
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

			apmElasticConnect.endTransaction([this.consumerUrl]);
			return error;
		}
	}

	@Action({
		cache: false,
		rest: 'PUT consumer/',
		name: 'service.alcis.put-new-consumer',
		group: 'flow-alcis'
	})
	public async putConsumer(context: any) {
		apmElasticConnect.startTransaction(
			'IA Version 1 => ALCIS - PUT Consumer',
			'request'
		);
		const putBody: IConsumerData = context.params;

		loggerElastic(
			this.indexName,
			'200',
			this.originLayer,
			this.serviceName,
			JSON.stringify(`put - ${this.consumerUrl}`),
			JSON.stringify(putBody)
		);

		try {
			const putResponse = await alcisRequestController(
				this.consumerUrl,
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
				JSON.stringify(putResponse.message)
			);

			apmElasticConnect.endTransaction([this.consumerUrl]);
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

			apmElasticConnect.endTransaction([this.consumerUrl]);
			return error;
		}
	}
}
