('use strict');

import * as dotenv from 'dotenv';
import { ServiceBroker } from 'moleculer';
import {
	apmElasticConnect,
	loggerElastic
} from '../../../../services/library/elasticSearch';
import { IListingBranchesSeniorGupy } from '../../../interface/senior/branch/listingBranchesSeniorGupy.interface';

dotenv.config();

export default class ListingBranchesController {
	broker = new ServiceBroker();
	routeApi: any;
	indexName = 'flow-senior';
	isCode = '200';
	originLayer = 'controller-senior';
	serviceName = 'ListingBranchesController';

	public async GetBranchesId(ctxListingBranch: IListingBranchesSeniorGupy) {
		try {
			const objBranch = {
				methos: 'get',
				body: '',
				params: {}
			};

			if (ctxListingBranch.id != undefined) {
				Object.assign(objBranch.params, {
					id: ctxListingBranch.id
				});
			}

			if (ctxListingBranch.name != undefined) {
				Object.assign(objBranch.params, {
					name: ctxListingBranch.name
				});
			}

			if (ctxListingBranch.code != undefined) {
				Object.assign(objBranch.params, {
					code: ctxListingBranch.code
				});
			}

			loggerElastic(
				this.indexName,
				this.isCode,
				this.originLayer,
				this.serviceName,
				JSON.stringify(ctxListingBranch),
				JSON.stringify(objBranch)
			);

			return objBranch;
		} catch (error) {
			loggerElastic(
				this.indexName,
				'429',
				this.originLayer,
				this.serviceName,
				JSON.stringify(ctxListingBranch),
				JSON.stringify(error.message)
			);

			apmElasticConnect
				.setTransactionName(this.indexName)
				.captureError(new Error(error.message));
		}
	}
}
