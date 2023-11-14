'use strict';

import * as dotenv from 'dotenv';
import {
	Service as MoleculerService,
	ServiceBroker,
	ServiceSchema
} from 'moleculer';
import { Action, Service } from 'moleculer-decorators';
import { alcisRequestController } from '../../../src/controller/alcis/services/alcisRequest.controller';
import { IOrderCancellationRequest } from '../../../src/interface/alcis/order/orderCancellationRequest/orderCancellationRequest.interface';
import { apmElasticConnect, loggerElastic } from '../../library/elasticSearch';

dotenv.config();
@Service({
	name: 'alcis-order-cancellation-request',
	group: 'flow-alcis'
})
export default class orderCancellationRequestData extends MoleculerService {
	public constructor(public broker: ServiceBroker, schema: ServiceSchema) {
		super(broker);
	}

	public indexName = 'flow-alcis-order-cancellation-request';
	public serviceName = 'order-cancellation-request.service';
	public originLayer = 'alcis';

	private orderCancellationRequestUrl =
		process.env.ALCIS_BASE_URL +
		process.env.ALCIS_ORDER_CANCELLATION_REQUEST_URL;

	@Action({
		cache: false,
		rest: 'POST post-cancellation/',
		name: 'service.alcis.post-cancellation',
		group: 'flow-alcis'
	})
	public async postOrderCancellationRequest(context: any) {
		apmElasticConnect.startTransaction(
			'IA Version 1 => ALCIS - POST Order Cancellation Request',
			'request'
		);
		const postBody: IOrderCancellationRequest = context.params;

		loggerElastic(
			this.indexName,
			'200',
			this.originLayer,
			this.serviceName,
			JSON.stringify(`post - ${this.orderCancellationRequestUrl}`),
			JSON.stringify(postBody)
		);

		try {
			const postResponse = await alcisRequestController(
				this.orderCancellationRequestUrl,
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

			apmElasticConnect.endTransaction([
				this.orderCancellationRequestUrl
			]);
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

			apmElasticConnect.endTransaction([
				this.orderCancellationRequestUrl
			]);
			return error;
		}
	}
}
