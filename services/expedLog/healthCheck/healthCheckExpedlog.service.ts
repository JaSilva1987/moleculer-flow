('use strict');

import { Errors, Service as MoleculerService, ServiceBroker } from 'moleculer';
import {
	StatusCodeExpedLog,
	TreatmentExpedLog
} from '../../../src/enum/expedLog/enum';

import { IExpedLogReturn } from '../../../src/interface/expedLog/expedLog.interface';
import { AxiosRequest } from '../../library/axios';

export default class HealthCheckExpedLog extends MoleculerService {
	indexName = 'flow-expedlog';
	isCode = '200';
	errCode = '499';
	originLayer = 'expedlog';
	serviceNameGet = 'HealthCheckExpedLogServiceGet';
	responseReturn: IExpedLogReturn | any;
	responseApi: IExpedLogReturn | any;

	public constructor(broker: ServiceBroker) {
		super(broker);

		this.parseServiceSchema({
			name: 'expedlog-health-check',
			group: 'flow-expedlog',
			actions: {
				post: {
					cache: false,
					rest: {
						method: 'GET',
						basePath: 'expedlog/',
						path: 'health-check/'
					},
					async handler(): Promise<IExpedLogReturn> {
						return await this.GetHealthCheck();
					}
				}
			}
		});
	}

	public async GetHealthCheck() {
		try {
			const request = await AxiosRequest({
				url:
					process.env.EXPEDLOG_BASE_URL +
					process.env.EXPEDLOG_HEALTH_CHECK_URL
			});

			if (request.status != 200)
				throw {
					status: +StatusCodeExpedLog.serverError,
					message: TreatmentExpedLog.serverError,
					detailedMessage:
						request?.message ||
						request ||
						TreatmentExpedLog.serverError
				};

			return await Promise.resolve({
				status: +StatusCodeExpedLog.success,
				message: TreatmentExpedLog.success,
				detailedMessage: request.message || TreatmentExpedLog.success
			});
		} catch (error) {
			return await Promise.reject(
				new Errors.MoleculerError(
					error.message || error.detailedMessage || error,
					+error.code || +error.status || 400
				)
			);
		}
	}
}
