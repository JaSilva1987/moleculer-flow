('use strict');

import * as dotenv from 'dotenv';
import { Service as MoleculerService, ServiceBroker } from 'moleculer';
import { Event, Service } from 'moleculer-decorators';
import { IJobGeneric } from '../../../src/interface/gupy/job/jobRolesSeniorGupy.interface';
import { axiosInterceptors } from '../../library/axios/axiosInterceptos';
import { apmElasticConnect, loggerElastic } from '../../library/elasticSearch';
dotenv.config();

@Service({
	name: 'senior.gupy.gupy.listingrole',
	group: 'flow-senior'
})
export default class ListingRolesService extends MoleculerService {
	returnResponse: object;
	indexName = 'flow-senior';
	isCode = '200';
	originLayer = 'gupy';
	serviceName = 'ListingRolesService';

	public constructor(public broker: ServiceBroker) {
		super(broker);
	}

	@Event({
		name: 'senior.gupy.jobroles',
		group: 'flow-senior'
	})
	public async GenericRolesSeniorGupy(genericRoles: IJobGeneric) {
		try {
			const objRequest = {
				objtRequest: {
					method: genericRoles.method,
					url: process.env.SENIOR_GUPY_URLBASE + 'roles',
					headers: {
						Authorization:
							'Bearer ' + process.env.SENIOR_GUPY_BEARER,
						[process.env.CONTENT_TYPE_NAME]:
							process.env.CONTENT_TYPE
					}
				}
			};

			if (genericRoles.body !== '') {
				Object.assign(objRequest.objtRequest, {
					data: JSON.stringify(genericRoles.body)
				});
			}

			if (Object.values(genericRoles).length !== 0) {
				Object.assign(objRequest.objtRequest, {
					params: genericRoles.params
				});
			}

			if (Object.values(genericRoles.params).length !== 0) {
				Object.assign(objRequest.objtRequest, {
					params: genericRoles.params
				});
			}

			this.returnResponse = await axiosInterceptors(objRequest);

			loggerElastic(
				this.indexName,
				this.isCode,
				this.originLayer,
				this.serviceName,
				JSON.stringify(genericRoles),
				JSON.stringify(this.returnResponse)
			);

			return this.returnResponse;
		} catch (error) {
			loggerElastic(
				this.indexName,
				'499',
				this.originLayer,
				this.serviceName,
				JSON.stringify(genericRoles),
				JSON.stringify(error.message)
			);

			apmElasticConnect
				.setTransactionName(this.indexName)
				.captureError(new Error(error.message))
				.endTransaction([error]);
		}
	}
}
