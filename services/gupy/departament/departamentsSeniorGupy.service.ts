('use strict');

import * as dotenv from 'dotenv';
import { Service as MoleculerService, ServiceBroker } from 'moleculer';
import { Event, Service } from 'moleculer-decorators';
import { IJobGeneric } from '../../../src/interface/gupy/job/jobRolesSeniorGupy.interface';
import { axiosInterceptors } from '../../library/axios/axiosInterceptos';
import { apmElasticConnect, loggerElastic } from '../../library/elasticSearch';
dotenv.config();

@Service({
	name: 'senior.gupy.gupy.departament',
	group: 'flow-senior'
})
export default class DepartamentService extends MoleculerService {
	returnResponse: object;
	indexName = 'flow-senior';
	isCode = '200';
	originLayer = 'gupy';
	serviceName = 'DepartamentService';

	public constructor(public broker: ServiceBroker) {
		super(broker);
	}

	@Event({
		name: 'senior.gupy.jobdepartaments',
		group: 'flow-senior'
	})
	public async GenericDepartamentsSeniorGupy(
		genericDepartaments: IJobGeneric
	) {
		try {
			const objRequest = {
				objtRequest: {
					method: genericDepartaments.method,
					url: process.env.SENIOR_GUPY_URLBASE + 'departments',
					headers: {
						Authorization:
							'Bearer ' + process.env.SENIOR_GUPY_BEARER,
						[process.env.CONTENT_TYPE_NAME]:
							process.env.CONTENT_TYPE
					}
				}
			};

			if (genericDepartaments.body !== '') {
				Object.assign(objRequest.objtRequest, {
					data: JSON.stringify(genericDepartaments.body)
				});
			}

			if (Object.values(genericDepartaments).length !== 0) {
				Object.assign(objRequest.objtRequest, {
					params: genericDepartaments.params
				});
			}

			if (Object.values(genericDepartaments.params).length !== 0) {
				Object.assign(objRequest.objtRequest, {
					params: genericDepartaments.params
				});
			}

			this.returnResponse = await axiosInterceptors(objRequest);

			loggerElastic(
				this.indexName,
				this.isCode,
				this.originLayer,
				this.serviceName,
				JSON.stringify(genericDepartaments),
				JSON.stringify(this.returnResponse)
			);

			return this.returnResponse;
		} catch (error) {
			loggerElastic(
				this.indexName,
				'499',
				this.originLayer,
				this.serviceName,
				JSON.stringify(genericDepartaments),
				JSON.stringify(error.message)
			);

			apmElasticConnect
				.setTransactionName(this.indexName)
				.captureError(new Error(error.message))
				.endTransaction([error]);
		}
	}
}
