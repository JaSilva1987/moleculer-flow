('use strict');

import * as dotenv from 'dotenv';
import { ServiceBroker } from 'moleculer';
import {
	apmElasticConnect,
	loggerElastic
} from '../../../../services/library/elasticSearch';
import { IListingDepartmentsSeniorGupy } from '../../../interface/senior/departament/listingDepartmentsSeniorGupy';

dotenv.config();

export default class ListingDepartmentsController {
	broker = new ServiceBroker();
	routeApi: any;
	indexName = 'flow-senior';
	isCode = '200';
	originLayer = 'controller-senior';
	serviceName = 'ListingDepartmentsService';

	public async GetDepartmentsSeniorGupy(
		ctxListingDepartment: IListingDepartmentsSeniorGupy
	) {
		try {
			const objDepartaments = {
				methos: 'get',
				body: '',
				params: {}
			};
			if (ctxListingDepartment.id != undefined) {
				Object.assign(objDepartaments.params, {
					id: ctxListingDepartment.id
				});
			}

			if (ctxListingDepartment.name != undefined) {
				Object.assign(objDepartaments.params, {
					name: ctxListingDepartment.name
				});
			}

			if (ctxListingDepartment.code != undefined) {
				Object.assign(objDepartaments.params, {
					code: ctxListingDepartment.code
				});
			}

			loggerElastic(
				this.indexName,
				this.isCode,
				this.originLayer,
				this.serviceName,
				JSON.stringify(ctxListingDepartment),
				JSON.stringify(objDepartaments)
			);

			return objDepartaments;
		} catch (error) {
			loggerElastic(
				this.indexName,
				'429',
				this.originLayer,
				this.serviceName,
				JSON.stringify(ctxListingDepartment),
				JSON.stringify(error.message)
			);

			apmElasticConnect
				.setTransactionName(this.indexName)
				.captureError(new Error(error.message));
		}
	}
}
