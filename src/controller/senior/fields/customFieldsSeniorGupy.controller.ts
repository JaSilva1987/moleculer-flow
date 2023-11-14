('use strict');

import * as dotenv from 'dotenv';
import { ServiceBroker } from 'moleculer';
import {
	apmElasticConnect,
	loggerElastic
} from '../../../../services/library/elasticSearch';
import { ICustomFieldsSeniorGupy } from '../../../interface/senior/job/customFieldsSeniorGupy.interface';

dotenv.config();

export default class CustomFieldsController {
	broker = new ServiceBroker();
	routeApi: any;
	indexName = 'flow-senior';
	isCode = '200';
	originLayer = 'controller-senior';
	serviceName = 'CustomFieldsController';

	public async GetCustomFieldsSeniorGupy(
		customFieldsSeniorGupy: ICustomFieldsSeniorGupy
	) {
		try {
			const objFields = {
				methos: 'get',
				body: '',
				params: {}
			};

			if (customFieldsSeniorGupy.id != undefined) {
				Object.assign(objFields.params, {
					id: customFieldsSeniorGupy.id
				});
			}

			if (customFieldsSeniorGupy.label != undefined) {
				Object.assign(objFields.params, {
					name: customFieldsSeniorGupy.label
				});
			}

			loggerElastic(
				this.indexName,
				this.isCode,
				this.originLayer,
				this.serviceName,
				JSON.stringify(customFieldsSeniorGupy),
				JSON.stringify(objFields)
			);

			return objFields;
		} catch (error) {
			loggerElastic(
				this.indexName,
				'429',
				this.originLayer,
				this.serviceName,
				JSON.stringify(customFieldsSeniorGupy),
				JSON.stringify(error.message)
			);

			apmElasticConnect
				.setTransactionName(this.indexName)
				.captureError(new Error(error.message));
		}
	}
}
