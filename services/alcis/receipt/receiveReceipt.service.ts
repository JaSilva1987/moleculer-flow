'use strict';

import * as dotenv from 'dotenv';
import {
	Service as MoleculerService,
	ServiceBroker,
	ServiceSchema
} from 'moleculer';
import { Action, Service } from 'moleculer-decorators';
import { alcisRequestController } from '../../../src/controller/alcis/services/alcisRequest.controller';
import { INewReceipt } from '../../../src/interface/alcis/receipt/receiveReceipt/receiveReceipt.interface';
import { apmElasticConnect, loggerElastic } from '../../library/elasticSearch';

dotenv.config();
@Service({
	name: 'alcis-receive-receipt',
	group: 'flow-alcis'
})
export default class receiveReceiptData extends MoleculerService {
	public constructor(public broker: ServiceBroker, schema: ServiceSchema) {
		super(broker);
	}

	public indexName = 'flow-alcis-receive-receipt';
	public serviceName = 'receipt.service';
	public originLayer = 'alcis';

	private receiveReceiptUrl =
		process.env.ALCIS_BASE_URL + process.env.ALCIS_RECEIVED_RECEIPT_URL;

	@Action({
		cache: false,
		rest: 'POST receive-receipt/',
		name: 'service.alcis.post-receive-receipt',
		group: 'flow-alcis'
	})
	public async postReceiveReceipt(context: any) {
		apmElasticConnect.startTransaction(
			'IA Version 1 => ALCIS - POST Receive Receipt',
			'request'
		);
		const postBody: INewReceipt = context.params;

		loggerElastic(
			this.indexName,
			'200',
			this.originLayer,
			this.serviceName,
			JSON.stringify(`post - ${this.receiveReceiptUrl}`),
			JSON.stringify(postBody)
		);

		try {
			const postResponse = await alcisRequestController(
				this.receiveReceiptUrl,
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

			apmElasticConnect.endTransaction([this.receiveReceiptUrl]);
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

			apmElasticConnect.endTransaction([this.receiveReceiptUrl]);
			return error;
		}
	}
}
