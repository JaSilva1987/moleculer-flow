'use strict';

import * as dotenv from 'dotenv';
import {
	Service as MoleculerService,
	ServiceBroker,
	ServiceSchema
} from 'moleculer';
import { Action, Service } from 'moleculer-decorators';
import { alcisRequestController } from '../../../src/controller/alcis/services/alcisRequest.controller';
import { INewStock } from '../../../src/interface/alcis/stock/newStock/newStock.interface';
import { apmElasticConnect, loggerElastic } from '../../library/elasticSearch';

dotenv.config();
@Service({
	name: 'alcis-stock',
	group: 'flow-alcis'
})
export default class stockData extends MoleculerService {
	public constructor(public broker: ServiceBroker, schema: ServiceSchema) {
		super(broker);
	}

	public indexName = 'flow-alcis-stock';
	public serviceName = 'stock.service';
	public originLayer = 'alcis';

	private stockUrl = process.env.ALCIS_BASE_URL + process.env.ALCIS_STOCK_URL;

	@Action({
		cache: false,
		rest: 'POST post-stock/',
		name: 'service.alcis.post-new-stock',
		group: 'flow-alcis'
	})
	public async postStock(context: any) {
		apmElasticConnect.startTransaction(
			'IA Version 1 => ALCIS - POST Stock',
			'request'
		);
		const postBody: INewStock = context.params;

		loggerElastic(
			this.indexName,
			'200',
			this.originLayer,
			this.serviceName,
			JSON.stringify(`post - ${this.stockUrl}`),
			JSON.stringify(postBody)
		);

		try {
			const postResponse = await alcisRequestController(
				this.stockUrl,
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

			apmElasticConnect.endTransaction([this.stockUrl]);
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

			apmElasticConnect.endTransaction([this.stockUrl]);
			return error;
		}
	}
}
