('use strict');

import * as dotenv from 'dotenv';
import { Service as MoleculerService, ServiceBroker } from 'moleculer';
import { Event, Service } from 'moleculer-decorators';
import { IJobGeneric } from '../../../src/interface/gupy/job/jobRolesSeniorGupy.interface';
import { axiosInterceptors } from '../../library/axios/axiosInterceptos';
import { apmElasticConnect, loggerElastic } from '../../library/elasticSearch';
dotenv.config();

@Service({
	name: 'senior.gupy.gupy.branch',
	group: 'flow-senior'
})
export default class BranchService extends MoleculerService {
	returnResponse: object;
	indexName = 'flow-senior';
	isCode = '200';
	originLayer = 'gupy';
	serviceName = 'BranchService';

	public constructor(public broker: ServiceBroker) {
		super(broker);
	}

	@Event({
		name: 'senior.gupy.jobbranchs',
		group: 'flow-senior'
	})
	public async GenericBranchSeniorGupy(genericBranchs: IJobGeneric) {
		try {
			const objRequest = {
				objtRequest: {
					method: genericBranchs.method,
					url: process.env.SENIOR_GUPY_URLBASE + 'branches',
					headers: {
						Authorization:
							'Bearer ' + process.env.SENIOR_GUPY_BEARER,
						[process.env.CONTENT_TYPE_NAME]:
							process.env.CONTENT_TYPE
					}
				}
			};

			if (genericBranchs.body !== '') {
				Object.assign(objRequest.objtRequest, {
					data: JSON.stringify(genericBranchs.body)
				});
			}

			if (Object.values(genericBranchs).length !== 0) {
				Object.assign(objRequest.objtRequest, {
					params: genericBranchs.params
				});
			}

			if (Object.values(genericBranchs.params).length !== 0) {
				Object.assign(objRequest.objtRequest, {
					params: genericBranchs.params
				});
			}

			this.returnResponse = await axiosInterceptors(objRequest);

			loggerElastic(
				this.indexName,
				this.isCode,
				this.originLayer,
				this.serviceName,
				JSON.stringify(genericBranchs),
				JSON.stringify(this.returnResponse)
			);

			return this.returnResponse;
		} catch (error) {
			loggerElastic(
				this.indexName,
				'499',
				this.originLayer,
				this.serviceName,
				JSON.stringify(genericBranchs),
				JSON.stringify(error.message)
			);

			apmElasticConnect
				.setTransactionName(this.indexName)
				.captureError(new Error(error.message))
				.endTransaction([error]);
		}
	}
}
