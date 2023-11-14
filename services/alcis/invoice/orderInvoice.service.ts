'use strict';

import * as dotenv from 'dotenv';
import {
	Service as MoleculerService,
	ServiceBroker,
	ServiceSchema
} from 'moleculer';
import { Action, Service } from 'moleculer-decorators';
import { alcisRequestController } from '../../../src/controller/alcis/services/alcisRequest.controller';
import { IOrderInvoice } from '../../../src/interface/alcis/invoice/orderInvoice/orderInvoice.interface';
import { apmElasticConnect, loggerElastic } from '../../library/elasticSearch';

dotenv.config();
@Service({
	name: 'alcis-order-invoice',
	group: 'flow-alcis'
})
export default class orderInvoiceData extends MoleculerService {
	public constructor(public broker: ServiceBroker, schema: ServiceSchema) {
		super(broker);
	}

	public indexName = 'flow-alcis-order-invoice';
	public serviceName = 'order-invoice.service';
	public originLayer = 'alcis';

	private orderInvoiceUrl =
		process.env.ALCIS_BASE_URL + process.env.ALCIS_ORDER_INVOICE_URL;

	public async started() {}
	@Action({
		cache: false,
		rest: 'PUT order-invoice/',
		name: 'service.alcis.put-order-invoice',
		group: 'flow-alcis'
	})
	public async putOrderInvoice(context: any) {
		apmElasticConnect.startTransaction(
			'IA Version 1 => ALCIS - PUT Order Invoice',
			'request'
		);
		const putBody: IOrderInvoice = context.params;

		loggerElastic(
			this.indexName,
			'200',
			this.originLayer,
			this.serviceName,
			JSON.stringify(`put - ${JSON.stringify(putBody)}`),
			JSON.stringify(putBody)
		);

		try {
			const putResponse = await alcisRequestController(
				this.orderInvoiceUrl,
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

			apmElasticConnect.endTransaction([this.orderInvoiceUrl]);
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

			apmElasticConnect.endTransaction([this.orderInvoiceUrl]);
			return error;
		}
	}
}
