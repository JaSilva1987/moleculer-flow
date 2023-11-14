'use strict';

import * as dotenv from 'dotenv';
import {
	Service as MoleculerService,
	ServiceBroker,
	ServiceSchema
} from 'moleculer';
import { Action, Service } from 'moleculer-decorators';
import { AxiosRequest } from '../../library/axios';

dotenv.config();
@Service({
	name: 'boxifarma',
	group: 'flow-boxifarma'
})
export default class healthCheckData extends MoleculerService {
	public constructor(public broker: ServiceBroker, schema: ServiceSchema) {
		super(broker);
	}

	public async started() {}
	@Action({
		cache: false,
		rest: 'GET health/',
		name: 'service.boxifarma.health',
		group: 'flow-boxifarma'
	})
	public async getHealth(context: any) {
		try {
			const config = {
				method: 'get',
				url:
					process.env.URL_PROTHEUS_BOXIFARMA +
					'VVESTW01?cCodigoEAN=7897337707077&cEmpresa=32&cFilialEmp=001001&cParToken=box@%23$@VIVEO10-%23integracao$2022!QAGAMA%2302345',
				headers: {
					Authorization: 'Basic ' + process.env.BOXIFARMA_BASIC
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
