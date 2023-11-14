'use strict';

import * as dotenv from 'dotenv';
import {
	Service as MoleculerService,
	ServiceBroker,
	ServiceSchema
} from 'moleculer';
import { axiosInterceptors } from '../../library/axios/axiosInterceptos';

dotenv.config();

export default class healthCheckService extends MoleculerService {
	public constructor(public broker: ServiceBroker, schema: ServiceSchema) {
		super(broker);
		this.parseServiceSchema({
			name: 'gupy.healthcheck',
			group: 'flow-gupy',
			actions: {
				create: {
					cache: false,
					rest: {
						method: 'GET',
						basePath: 'gupy',
						path: '/healthcheck'
					},
					async handler() {
						const objectReturn = {
							Camada: {},
							Gupy: {}
						};

						const objRequest = {
							objtRequest: {
								method: 'get',
								url: process.env.SENIOR_GUPY_URLBASE + 'jobs',
								headers: {
									Authorization:
										'Bearer ' +
										process.env.SENIOR_GUPY_BEARER,
									[process.env.CONTENT_TYPE_NAME]:
										process.env.CONTENT_TYPE
								}
							}
						};

						this.returnResponse = await axiosInterceptors(
							objRequest
						);

						if (this.returnResponse.status > 400) {
							Object.assign(objectReturn.Gupy, {
								code: 500,
								status: 'DOWN',
								verificationTime: new Date()
							});
						} else {
							Object.assign(objectReturn.Gupy, {
								code: 200,
								status: 'DOWN',
								verificationTime: new Date()
							});
						}

						Object.assign(objectReturn.Camada, {
							code: 200,
							status: 'UP',
							verificationTime: new Date()
						});

						return objectReturn;
					}
				}
			}
		});
	}
}
