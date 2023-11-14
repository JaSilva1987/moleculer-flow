'use strict';

import * as dotenv from 'dotenv';
import {
	Service as MoleculerService,
	ServiceBroker,
	ServiceSchema
} from 'moleculer';
import { Action, Service } from 'moleculer-decorators';
import { alcisRequestController } from '../../../src/controller/alcis/services/alcisRequest.controller';
import { IReceiptCancellation } from '../../../src/interface/alcis/receipt/receiptCancellation/receiptCancellation.interface';
import { apmElasticConnect, loggerElastic } from '../../library/elasticSearch';

dotenv.config();
@Service({
	name: 'alcis-receipt',
	group: 'flow-alcis'
})
export default class receiptCancellationData extends MoleculerService {
	public constructor(public broker: ServiceBroker, schema: ServiceSchema) {
		super(broker);
	}

	public indexName = 'flow-alcis-receipt-cancellation';
	public serviceName = 'receipt-cancellation.service';
	public originLayer = 'alcis';

	private receiptCancellationUrl =
		process.env.ALCIS_BASE_URL + process.env.ALCIS_RECEIPT_CANCELLATION_URL;

	@Action({
		cache: false,
		rest: 'PUT receipt-cancellation/',
		name: 'service.alcis.put-receipt-cancellation',
		group: 'flow-alcis'
	})
	public async putReceiptCancellation(context: any) {
		apmElasticConnect.startTransaction(
			'IA Version 1 => ALCIS - PUT Receipt Cancellation',
			'request'
		);
		const putBody: IReceiptCancellation = context.params;

		loggerElastic(
			this.indexName,
			'200',
			this.originLayer,
			this.serviceName,
			JSON.stringify(`put - ${this.receiptCancellationUrl}`),
			JSON.stringify(putBody)
		);

		try {
			const putResponse = await alcisRequestController(
				this.receiptCancellationUrl,
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

			apmElasticConnect.endTransaction([this.receiptCancellationUrl]);
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

			apmElasticConnect.endTransaction([this.receiptCancellationUrl]);
			return error;
		}
	}
}
