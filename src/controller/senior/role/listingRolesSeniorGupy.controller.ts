('use strict');

import * as dotenv from 'dotenv';
import { ServiceBroker } from 'moleculer';
import {
	apmElasticConnect,
	loggerElastic
} from '../../../../services/library/elasticSearch';
import { IListingRolesSeniorGupy } from '../../../interface/senior/role/listingRolesSeniorGupy.interface';

dotenv.config();

export default class ListingRolesController {
	broker = new ServiceBroker();
	routeApi: any;
	indexName = 'flow-senior';
	isCode = '200';
	originLayer = 'controller-senior';
	serviceName = 'ListingRolesController';

	public async GetRolesId(ctxListingRole: IListingRolesSeniorGupy) {
		try {
			const objRoles = {
				methos: 'get',
				body: '',
				params: {}
			};

			if (ctxListingRole.id != undefined) {
				Object.assign(objRoles.params, {
					id: ctxListingRole.id
				});
			}

			if (ctxListingRole.name != undefined) {
				Object.assign(objRoles.params, {
					name: ctxListingRole.name
				});
			}

			if (ctxListingRole.code != undefined) {
				Object.assign(objRoles.params, {
					code: ctxListingRole.code
				});
			}

			loggerElastic(
				this.indexName,
				this.isCode,
				this.originLayer,
				this.serviceName,
				JSON.stringify(ctxListingRole),
				JSON.stringify(objRoles)
			);

			return objRoles;
		} catch (error) {
			loggerElastic(
				this.indexName,
				'429',
				this.originLayer,
				this.serviceName,
				JSON.stringify(ctxListingRole),
				JSON.stringify(error.message)
			);

			apmElasticConnect
				.setTransactionName(this.indexName)
				.captureError(new Error(error.message));
		}
	}
}
