'use strict';

import * as dotenv from 'dotenv';
import {
	Service as MoleculerService,
	ServiceBroker,
	ServiceSchema
} from 'moleculer';
import { Action, Service } from 'moleculer-decorators';
import { alcisRequestController } from '../../../src/controller/alcis/services/alcisRequest.controller';
import { IOrderCancellation } from '../../../src/interface/alcis/order/orderCancellation/orderCancellation.interface';
import { apmElasticConnect, loggerElastic } from '../../library/elasticSearch';

dotenv.config();
@Service({
	name: 'alcis-order-cancellation',
	group: 'flow-alcis'
})
export default class orderCancellationData extends MoleculerService {
	public constructor(public broker: ServiceBroker, schema: ServiceSchema) {
		super(broker);
	}

	public indexName = 'flow-alcis-order-cancellation';
	public serviceName = 'order-cancellation.service';
	public originLayer = 'alcis';

	private orderCancellationUrl =
		process.env.ALCIS_BASE_URL + process.env.ALCIS_ORDER_CANCELLATION_URL;

	public async started() {}
	@Action({
		cache: false,
		rest: 'GET order-cancellation/',
		name: 'service.alcis.get-order-cancellation',
		group: 'flow-alcis'
	})
	public async getOrderCancellation(context: any) {
		apmElasticConnect.startTransaction(
			'IA Version 1 => ALCIS - GET Order Cancellation',
			'request'
		);
		let getOrderCancellationParams = context.params;

		loggerElastic(
			this.indexName,
			'200',
			this.originLayer,
			this.serviceName,
			JSON.stringify(`get - ${this.orderCancellationUrl}`),
			JSON.stringify(getOrderCancellationParams)
		);

		try {
			const getResponse = await alcisRequestController(
				this.orderCancellationUrl,
				null,
				'Authorization',
				'get',
				null,
				null,
				null,
				null,
				getOrderCancellationParams
			);

			if (getResponse instanceof Error) {
				throw getResponse;
			}

			context.meta.$statusCode = getResponse.status;

			loggerElastic(
				this.indexName,
				String(getResponse.status),
				this.originLayer,
				this.serviceName,
				JSON.stringify(`get - ${this.orderCancellationUrl}`),
				JSON.stringify(getResponse)
			);

			apmElasticConnect.endTransaction([this.orderCancellationUrl]);
			return getResponse.message;
		} catch (error) {
			const errorStatus = error?.status || error?.code || 400;

			loggerElastic(
				this.indexName,
				String(errorStatus),
				this.originLayer,
				this.serviceName,
				JSON.stringify(`get - ${this.orderCancellationUrl}`),
				JSON.stringify(error)
			);

			context.meta.$statusCode = +errorStatus;

			apmElasticConnect.endTransaction([this.orderCancellationUrl]);
			return error;
		}
	}

	@Action({
		cache: false,
		rest: 'PUT order-cancellation/',
		name: 'service.alcis.put-order-cancellation',
		group: 'flow-alcis'
	})
	public async putOrderCancellation(context: any) {
		apmElasticConnect.startTransaction(
			'IA Version 1 => ALCIS - PUT Order Cancellation',
			'request'
		);
		const putBody: IOrderCancellation = context.params;

		loggerElastic(
			this.indexName,
			'200',
			this.originLayer,
			this.serviceName,
			JSON.stringify(`put - ${this.orderCancellationUrl}`),
			JSON.stringify(putBody)
		);

		try {
			const putResponse = await alcisRequestController(
				this.orderCancellationUrl,
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

			apmElasticConnect.endTransaction([this.orderCancellationUrl]);
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

			apmElasticConnect.endTransaction([this.orderCancellationUrl]);
			return error;
		}
	}
}
