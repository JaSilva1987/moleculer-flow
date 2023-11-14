'use strict';

import * as dotenv from 'dotenv';
import {
	Service as MoleculerService,
	ServiceBroker,
	ServiceSchema
} from 'moleculer';
import { Event, Service } from 'moleculer-decorators';
import { connectionIntegrador } from '../../../src/data-source';
import { loggerElastic } from '../../library/elasticSearch';

dotenv.config();
@Service({
	name: 'validationOrder',
	group: 'flow-cremmer'
})
export default class validationOrder extends MoleculerService {
	public allOrders: Object;

	public constructor(public broker: ServiceBroker, schema: ServiceSchema) {
		super(broker);
	}

	public indexName = 'flow-crmiso-routeorders';
	public originLayer = 'crmiso';

	async started() {
		try {
			await connectionIntegrador.initialize();
		} catch (error) {
			loggerElastic(
				this.indexName,
				'499',
				this.originLayer,
				this.serviceName,
				JSON.stringify(error.message)
			);
			this.logger.error(error.message, 500);
		}
	}

	@Event({
		name: 'service.integration.order.validationOrder',
		group: 'cremer'
	})
	public async ValidationOrder(message: any) {
		this.logger.info(
			'==============GRAVA DADOS DO LOG INTEGRADOR=============='
		);
	}

	async stoped() {
		return await connectionIntegrador.destroy();
	}
}
