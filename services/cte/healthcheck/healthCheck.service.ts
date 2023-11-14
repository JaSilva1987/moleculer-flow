'use strict';

import * as dotenv from 'dotenv';
import {
	Service as MoleculerService,
	ServiceBroker,
	ServiceSchema
} from 'moleculer';
import { Action, Service } from 'moleculer-decorators';
import { IGetToken } from '../../../src/interface/erpProtheus/global';
import { getTokenUrlGlobal } from '../../library/erpProtheus';

dotenv.config();
@Service({
	name: 'cte-healthcheck',
	group: 'flow-cte'
})
export default class healthCheckCte extends MoleculerService {
	public constructor(public broker: ServiceBroker, schema: ServiceSchema) {
		super(broker);
	}

	public async started() {}
	@Action({
		cache: false,
		rest: {
			method: 'GET',
			basePath: 'cte/',
			path: 'health/'
		},

		name: 'cte-health',
		group: 'flow-cte'
	})
	public async getHealth(context: any) {
		try {
			const statusUp: IGetToken = await getTokenUrlGlobal(
				process.env.PROTHEUSVIVEO_CTE_BASEURL +
					process.env.PROTHEUSVIVEO_PASS_CTE
			);

			if (statusUp.access_token) {
				const healthStatus = {
					Protheus: {
						code: 200,
						status: 'UP',
						verificationTime: new Date()
					},
					Camada: {
						code: 200,
						status: 'UP',
						verificationTime: new Date()
					}
				};

				return healthStatus;
			} else {
				throw statusUp;
			}
		} catch (error) {
			const errorStatus = 500;
			const healthStatus = {
				Protheus: {
					code: errorStatus,
					status: 'DOWN',
					verificationTime: new Date()
				},
				Camada: {
					code: 200,
					status: 'UP',
					verificationTime: new Date()
				}
			};

			context.meta.$statusCode = +errorStatus;

			return healthStatus;
		}
	}
}
