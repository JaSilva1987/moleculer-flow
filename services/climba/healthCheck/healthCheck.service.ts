'use strict';

import {
	Service as MoleculerService,
	ServiceBroker,
	ServiceSchema
} from 'moleculer';
import { Action, Service } from 'moleculer-decorators';
import * as dotenv from 'dotenv';
import { AxiosRequest } from '../../library/axios';

dotenv.config();
@Service({
	name: 'climba',
	group: 'climba-ecommerce'
})
export default class HealthCheck extends MoleculerService {
	public constructor(public broker: ServiceBroker, schema: ServiceSchema) {
		super(broker);
	}

	@Action({
		cache: false,
		rest: 'GET health/',
		name: 'service.climba.health.getHealth',
		group: 'flow-climba'
	})
	public async getHealth(context: any) {
		try {
			const config = {
				method: 'get',
				url: process.env.URL_ECOMMERCE + 'brands',
				headers: {
					'x-idcommerce-api-token': process.env.TOKEN_ECOMMERCE
				}
			};

			const statusUp: any = await AxiosRequest(config);

			if (statusUp.status == 200 || statusUp.status == 201) {
				const healthStatus = {
					code: 200,
					status: 'UP',
					verificationTime: new Date()
				};

				return healthStatus;
			} else {
				throw statusUp;
			}
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
