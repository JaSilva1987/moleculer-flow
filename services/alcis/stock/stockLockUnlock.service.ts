'use strict';

import * as dotenv from 'dotenv';
import {
	Service as MoleculerService,
	ServiceBroker,
	ServiceSchema
} from 'moleculer';
import { Action, Service } from 'moleculer-decorators';
import { alcisRequestController } from '../../../src/controller/alcis/services/alcisRequest.controller';
import { IStockLockUnlockNotification } from '../../../src/interface/alcis/stock/lockUnlock/newStockLockUnlock.interface';
import { apmElasticConnect, loggerElastic } from '../../library/elasticSearch';

dotenv.config();
@Service({
	name: 'alcis-stock-lock-unlock',
	group: 'flow-alcis'
})
export default class stockLockUnlockData extends MoleculerService {
	public constructor(public broker: ServiceBroker, schema: ServiceSchema) {
		super(broker);
	}

	public indexName = 'flow-alcis-stock-lock-unlock';
	public serviceName = 'stock-lock-unlock.service';
	public originLayer = 'alcis';

	private stockLockUnlockUrl =
		process.env.ALCIS_BASE_URL + process.env.ALCIS_STOCK_LOCK_UNLOCK_URL;

	public async started() {}
	@Action({
		cache: false,
		rest: 'GET stock-lock-unlock/',
		name: 'service.alcis.get-stock-lock-unlock',
		group: 'flow-alcis'
	})
	public async getStockLockUnlock(context: any) {
		apmElasticConnect.startTransaction(
			'IA Version 1 => ALCIS - GET Stock Lock Unlock',
			'request'
		);
		let getParams = context.params;

		loggerElastic(
			this.indexName,
			'200',
			this.originLayer,
			this.serviceName,
			JSON.stringify(`get - ${this.stockLockUnlockUrl}`),
			JSON.stringify(getParams)
		);

		try {
			const getResponse = await alcisRequestController(
				this.stockLockUnlockUrl,
				null,
				'Authorization',
				'get',
				null,
				null,
				null,
				null,
				getParams
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
				JSON.stringify(`get - ${this.stockLockUnlockUrl}`),
				JSON.stringify(getResponse)
			);

			apmElasticConnect.endTransaction([this.stockLockUnlockUrl]);
			return getResponse.message;
		} catch (error) {
			const errorStatus = error?.status || error?.code || 400;

			loggerElastic(
				this.indexName,
				String(errorStatus),
				this.originLayer,
				this.serviceName,
				JSON.stringify(`get - ${this.stockLockUnlockUrl}`),
				JSON.stringify(error)
			);

			context.meta.$statusCode = +errorStatus;

			apmElasticConnect.endTransaction([this.stockLockUnlockUrl]);
			return error;
		}
	}

	@Action({
		cache: false,
		rest: 'PUT stock-lock-unlock/',
		name: 'service.alcis.put-stock-lock-unlock',
		group: 'flow-alcis'
	})
	public async putStockLockUnlock(context: any) {
		apmElasticConnect.startTransaction(
			'IA Version 1 => ALCIS - PUT Stock Lock Unlock',
			'request'
		);
		const putBody: IStockLockUnlockNotification = context.params;

		loggerElastic(
			this.indexName,
			'200',
			this.originLayer,
			this.serviceName,
			JSON.stringify(`put - ${this.stockLockUnlockUrl}`),
			JSON.stringify(putBody)
		);

		try {
			const putResponse = await alcisRequestController(
				this.stockLockUnlockUrl,
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

			apmElasticConnect.endTransaction([this.stockLockUnlockUrl]);
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

			apmElasticConnect.endTransaction([this.stockLockUnlockUrl]);
			return error;
		}
	}
}
