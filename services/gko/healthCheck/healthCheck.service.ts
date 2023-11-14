'use strict';

import {
	Service as MoleculerService,
	ServiceBroker,
	ServiceSchema
} from 'moleculer';
import { Action, Service } from 'moleculer-decorators';
import * as dotenv from 'dotenv';
import { getToken } from '../../library/gko';

dotenv.config();
@Service({
	name: 'gko',
	group: 'flow-gko'
})
export default class healthCheckData extends MoleculerService {
	public constructor(public broker: ServiceBroker, schema: ServiceSchema) {
		super(broker);
	}

	public async started() {}
	@Action({
		cache: false,
		rest: 'GET health/',
		name: 'service.gko.health',
		group: 'flow-gko'
	})
	public async getHealth(context: any) {
		try {
			const tokenGko: any = await getToken();

			if (tokenGko instanceof Error) {
				throw tokenGko;
			}

			context.meta.$statusCode = 200;

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
