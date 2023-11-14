'use strict';

import * as dotenv from 'dotenv';
import {
	Service as MoleculerService,
	ServiceBroker,
	ServiceSchema
} from 'moleculer';
import { Action, Service } from 'moleculer-decorators';
import { getToken } from '../../library/alcis';

dotenv.config();
@Service({
	name: 'alcis',
	group: 'flow-alcis'
})
export default class healthCheckData extends MoleculerService {
	public constructor(public broker: ServiceBroker, schema: ServiceSchema) {
		super(broker);
	}

	public async started() {}
	@Action({
		cache: false,
		rest: 'GET health/',
		name: 'service.alcis.health',
		group: 'flow-alcis'
	})
	public async getHealth(context: any) {
		try {
			const tokenAlcis = await getToken(
				process.env.ALCIS_TOKEN_ALIAS_CREMER
			);

			if (tokenAlcis instanceof Error) {
				throw tokenAlcis;
			}

			const healthStatus = {
				code: 200,
				status: 'UP',
				verificationTime: new Date()
			};

			return healthStatus;
		} catch (error) {
			const errorStatus = error.status || 500;
			const healthStatus = {
				code: errorStatus,
				status: 'DOWN',
				verificationTime: new Date()
			};

			context.meta.$statusCode = +errorStatus;

			return healthStatus;
		}
	}
}
