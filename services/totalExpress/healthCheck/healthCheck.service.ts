'use strict';

import {
	Service as MoleculerService,
	ServiceBroker,
	ServiceSchema
} from 'moleculer';
import { Action, Service } from 'moleculer-decorators';
import * as dotenv from 'dotenv';
import { AxiosRequestType } from '../../library/axios';
import { apmElasticConnect } from '../../library/elasticSearch';

dotenv.config();
@Service({
	name: 'totalexpress',
	group: 'flow-totalexpress'
})
export default class HealthCheck extends MoleculerService {
	public constructor(public broker: ServiceBroker, schema: ServiceSchema) {
		super(broker);
	}

	@Action({
		cache: false,
		rest: 'GET health/',
		name: 'service.totalexpress.health',
		group: 'flow-totalexpress'
	})
	public async getHealth(context: any) {
		try {
			const bodyRequest: Object = {
				grant_type: 'password',
				username: process.env.TOTAL_EXPRESS_USER_AUTH,
				password: process.env.TOTAL_EXPRESS_PASS_AUTH
			};

			apmElasticConnect.startTransaction(
				'ITE V1 => TotalExpress - POST Token',
				'request'
			);
			const responseToken = await AxiosRequestType(
				process.env.TOTAL_EXPRESS_BASE_URL +
					`/ics-seguranca/v1/oauth2/tokenGerar`,
				bodyRequest,
				'post',
				{
					Authorization: `Basic ${process.env.TOTAL_EXPRESS_AUTH_TOKEN}`
				}
			);
			apmElasticConnect.endTransaction(responseToken);

			if (responseToken.status == 200) {
				const healthStatus = {
					code: 200,
					status: 'UP',
					verificationTime: new Date()
				};

				return healthStatus;
			} else {
				throw responseToken;
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
