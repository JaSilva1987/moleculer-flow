'use strict';

import * as dotenv from 'dotenv';
import {
	Service as MoleculerService,
	ServiceBroker,
	ServiceSchema
} from 'moleculer';
import { Action, Service } from 'moleculer-decorators';
import { alcisRequestController } from '../../../src/controller/alcis/services/alcisRequest.controller';
import { IOrderDispatchNotification } from '../../../src/interface/alcis/order/orderDispatch/orderDispatch.interface';
import { apmElasticConnect, loggerElastic } from '../../library/elasticSearch';

dotenv.config();
@Service({
	name: 'alcis-order-dispatch',
	group: 'flow-alcis'
})
export default class orderDispatchData extends MoleculerService {
	public constructor(public broker: ServiceBroker, schema: ServiceSchema) {
		super(broker);
	}

	public indexName = 'flow-alcis-order-dispatch';
	public serviceName = 'order-dispatch.service';
	public originLayer = 'alcis';

	private orderDispatchUrl =
		process.env.ALCIS_BASE_URL + process.env.ALCIS_ORDER_DISPATCH_URL;

	public async started() {}
	@Action({
		cache: false,
		rest: 'GET order-dispatch/',
		name: 'service.alcis.get-order-dispatch',
		group: 'flow-alcis'
	})
	public async getOrderConfirmation(context: any) {
		apmElasticConnect.startTransaction(
			'IA Version 1 => ALCIS - GET Order Dispatch',
			'request'
		);
		let getorderDispatchParams = context.params;

		loggerElastic(
			this.indexName,
			'200',
			this.originLayer,
			this.serviceName,
			JSON.stringify(`get - ${this.orderDispatchUrl}`),
			JSON.stringify(getorderDispatchParams)
		);

		try {
			const getResponse = await alcisRequestController(
				this.orderDispatchUrl,
				null,
				'Authorization',
				'get',
				null,
				null,
				null,
				null,
				getorderDispatchParams
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
				JSON.stringify(`get - ${this.orderDispatchUrl}`),
				JSON.stringify(getResponse)
			);

			apmElasticConnect.endTransaction([this.orderDispatchUrl]);
			return getResponse.message;
		} catch (error) {
			const errorStatus = error?.status || error?.code || 400;

			loggerElastic(
				this.indexName,
				String(errorStatus),
				this.originLayer,
				this.serviceName,
				JSON.stringify(`get - ${this.orderDispatchUrl}`),
				JSON.stringify(error)
			);

			context.meta.$statusCode = +errorStatus;

			apmElasticConnect.endTransaction([this.orderDispatchUrl]);
			return error;
		}
	}

	@Action({
		cache: false,
		rest: 'PUT order-dispatch/',
		name: 'service.alcis.put-order-dispatch',
		group: 'flow-alcis'
	})
	public async putOrderDispatch(context: any) {
		apmElasticConnect.startTransaction(
			'IA Version 1 => ALCIS - PUT Order Dispatch',
			'request'
		);
		const putBody: IOrderDispatchNotification = context.params;

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
				this.orderDispatchUrl,
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

			apmElasticConnect.endTransaction([this.orderDispatchUrl]);
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

			apmElasticConnect.endTransaction([this.orderDispatchUrl]);
			return error;
		}
	}
}
