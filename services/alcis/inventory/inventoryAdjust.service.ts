'use strict';

import * as dotenv from 'dotenv';
import {
	Service as MoleculerService,
	ServiceBroker,
	ServiceSchema
} from 'moleculer';
import { Action, Service } from 'moleculer-decorators';
import { alcisRequestController } from '../../../src/controller/alcis/services/alcisRequest.controller';
import { IInventoryAdjust } from '../../../src/interface/alcis/inventory/inventoryAdjust.interface';
import { apmElasticConnect, loggerElastic } from '../../library/elasticSearch';

dotenv.config();
@Service({
	name: 'alcis-inventory-adjust',
	group: 'flow-alcis'
})
export default class inventoryAdjustData extends MoleculerService {
	public constructor(public broker: ServiceBroker, schema: ServiceSchema) {
		super(broker);
	}

	public indexName = 'flow-alcis-inventory-adjust';
	public serviceName = 'inventory-adjust.service';
	public originLayer = 'alcis';

	private inventoryAdjustUrl =
		process.env.ALCIS_BASE_URL + process.env.ALCIS_INVENTORY_ADJUST_URL;

	public async started() {}
	@Action({
		cache: false,
		rest: 'GET inventory-adjust/',
		name: 'service.alcis.get-inventory-adjust',
		group: 'flow-alcis'
	})
	public async getInventoryAdjust(context: any) {
		apmElasticConnect.startTransaction(
			'IA Version 1 => ALCIS - GET Inventory Adjust',
			'request'
		);
		let getInventoryAdjustParams = context.params;

		loggerElastic(
			this.indexName,
			'200',
			this.originLayer,
			this.serviceName,
			JSON.stringify(`get - ${this.inventoryAdjustUrl}`),
			JSON.stringify(getInventoryAdjustParams)
		);

		try {
			const getResponse = await alcisRequestController(
				this.inventoryAdjustUrl,
				null,
				'Authorization',
				'get',
				null,
				null,
				null,
				null,
				getInventoryAdjustParams
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
				JSON.stringify(`get - ${this.inventoryAdjustUrl}`),
				JSON.stringify(getResponse)
			);

			apmElasticConnect.endTransaction([this.inventoryAdjustUrl]);
			return getResponse.message;
		} catch (error) {
			const errorStatus = error?.status || error?.code || 400;

			loggerElastic(
				this.indexName,
				String(errorStatus),
				this.originLayer,
				this.serviceName,
				JSON.stringify(`get - ${this.inventoryAdjustUrl}`),
				JSON.stringify(error)
			);

			context.meta.$statusCode = +errorStatus;
			apmElasticConnect.endTransaction([this.inventoryAdjustUrl]);
			return error;
		}
	}

	@Action({
		cache: false,
		rest: 'PUT inventory-adjust/',
		name: 'service.alcis.put-inventory-adjust',
		group: 'flow-alcis'
	})
	public async putInventoryAdjust(context: any) {
		apmElasticConnect.startTransaction(
			'IA Version 1 => ALCIS - PUT Inventory Adjust',
			'request'
		);
		const putBody: IInventoryAdjust = context.params;

		loggerElastic(
			this.indexName,
			'200',
			this.originLayer,
			this.serviceName,
			JSON.stringify(`put - ${this.inventoryAdjustUrl}`),
			JSON.stringify(putBody)
		);

		try {
			const putResponse = await alcisRequestController(
				this.inventoryAdjustUrl,
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

			apmElasticConnect.endTransaction([this.inventoryAdjustUrl]);
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

			apmElasticConnect.endTransaction([this.inventoryAdjustUrl]);
			return error;
		}
	}
}
