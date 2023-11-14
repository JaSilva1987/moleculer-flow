'use strict';

import * as dotenv from 'dotenv';
import {
	Service as MoleculerService,
	ServiceBroker,
	ServiceSchema
} from 'moleculer';
import { Action, Service } from 'moleculer-decorators';
import { alcisRequestController } from '../../../src/controller/alcis/services/alcisRequest.controller';
import { IOrderStatus } from '../../../src/interface/alcis/order/orderStatus/orderStatus.interface';
import { apmElasticConnect, loggerElastic } from '../../library/elasticSearch';

dotenv.config();
@Service({
	name: 'alcis-order-status',
	group: 'flow-alcis'
})
export default class orderStatusData extends MoleculerService {
	public constructor(public broker: ServiceBroker, schema: ServiceSchema) {
		super(broker);
	}

	public indexName = 'flow-alcis-order-status';
	public serviceName = 'order-status.service';
	public originLayer = 'alcis';

	private orderStatusUrl =
		process.env.ALCIS_BASE_URL + process.env.ALCIS_ORDER_STATUS_URL;

	public async started() {}
	@Action({
		cache: false,
		rest: 'PUT order-status/',
		name: 'service.alcis.put-order-status',
		group: 'flow-alcis'
	})
	public async putOrderCancellation(context: any) {
		apmElasticConnect.startTransaction(
			'IA Version 1 => ALCIS - PUT Order Status',
			'request'
		);
		const putBody: IOrderStatus = context.params;

		loggerElastic(
			this.indexName,
			'200',
			this.originLayer,
			this.serviceName,
			JSON.stringify(`put - ${this.orderStatusUrl}`),
			JSON.stringify(putBody)
		);

		try {
			const putResponse = await alcisRequestController(
				this.orderStatusUrl,
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

			apmElasticConnect.endTransaction([this.orderStatusUrl]);
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

			apmElasticConnect.endTransaction([this.orderStatusUrl]);
			return error;
		}
	}
}
