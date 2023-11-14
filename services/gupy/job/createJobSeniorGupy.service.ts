('use strict');

import * as dotenv from 'dotenv';
import { Service as MoleculerService, ServiceBroker } from 'moleculer';
import { Event, Service } from 'moleculer-decorators';
import { ICreateJobSeniorGupy } from '../../../src/interface/senior/job/createJobSeniorGupy.interface';
import { axiosInterceptors } from '../../library/axios/axiosInterceptos';
import { apmElasticConnect, loggerElastic } from '../../library/elasticSearch';
dotenv.config();

@Service({
	name: 'senior.gupy.gupy.createjob',
	group: 'flow-senior'
})
export default class CreateJobService extends MoleculerService {
	returnResponse: object;
	indexName = 'flow-senior';
	isCode = '200';
	originLayer = 'gupy';
	serviceName = 'CreateJobService';

	public constructor(public broker: ServiceBroker) {
		super(broker);
	}

	@Event({
		name: 'senior.gupy.post.createjob',
		group: 'flow-senior'
	})
	public async PostCreateJobSeniorGupy(
		gupySerniorCreate: ICreateJobSeniorGupy
	) {
		try {
			const objRequest = {
				objtRequest: {
					method: 'post',
					url: process.env.SENIOR_GUPY_URLBASE + 'jobs',
					headers: {
						Authorization:
							'Bearer ' + process.env.SENIOR_GUPY_BEARER,
						[process.env.CONTENT_TYPE_NAME]:
							process.env.CONTENT_TYPE
					},
					data: JSON.stringify(gupySerniorCreate)
				}
			};

			this.returnResponse = await axiosInterceptors(objRequest);

			loggerElastic(
				this.indexName,
				this.isCode,
				this.originLayer,
				this.serviceName,
				JSON.stringify(objRequest),
				JSON.stringify(this.returnResponse)
			);

			return this.returnResponse;
		} catch (error) {
			loggerElastic(
				this.indexName,
				'499',
				this.originLayer,
				this.serviceName,
				JSON.stringify(gupySerniorCreate),
				JSON.stringify(error.message)
			);

			apmElasticConnect
				.setTransactionName(this.indexName)
				.captureError(new Error(error.message))
				.endTransaction([error]);
		}
	}
}
