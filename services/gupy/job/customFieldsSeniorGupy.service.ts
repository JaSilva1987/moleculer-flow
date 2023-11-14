('use strict');

import * as dotenv from 'dotenv';
import { Service as MoleculerService, ServiceBroker } from 'moleculer';
import { Event, Service } from 'moleculer-decorators';
import { IJobFields } from '../../../src/interface/senior/job/customFieldsSeniorGupy.interface';
import { axiosInterceptors } from '../../library/axios/axiosInterceptos';
import { apmElasticConnect, loggerElastic } from '../../library/elasticSearch';
dotenv.config();

@Service({
	name: 'senior.gupy.gupy.customfields',
	group: 'flow-senior'
})
export default class CustomFieldsService extends MoleculerService {
	returnResponse: object;
	indexName = 'flow-senior';
	isCode = '200';
	originLayer = 'gupy';
	serviceName = 'CustomFieldsService';

	public constructor(public broker: ServiceBroker) {
		super(broker);
	}

	@Event({
		name: 'senior.gupy.jobcustomfields',
		group: 'flow-senior'
	})
	public async GenericBranchSeniorGupy(genericBranchs: IJobFields) {
		try {
			const objRequest = {
				objtRequest: {
					method: genericBranchs.method,
					url: process.env.SENIOR_GUPY_URLBASE + 'job-custom-fields',
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

			if (Object.values(genericBranchs.params).length !== 0) {
				Object.assign(objRequest.objtRequest, {
					params: genericBranchs.params
				});
			}

			this.returnResponse = await axiosInterceptors(objRequest);
			console.log(this.returnResponse);

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
