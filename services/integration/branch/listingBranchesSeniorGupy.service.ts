('use strict');

import { Service as MoleculerService, ServiceBroker } from 'moleculer';
import { Event, Service } from 'moleculer-decorators';

import ListingBranchesController from '../../../src/controller/senior/branch/listingBranchesSeniorGupy.controller';
import { IListingBranchesSeniorGupy } from '../../../src/interface/senior/branch/listingBranchesSeniorGupy.interface';
import { apmElasticConnect, loggerElastic } from '../../library/elasticSearch';

@Service({
	name: 'senior.gupy.integration.listingbranches',
	group: 'flow-senior'
})
export default class ListingBranchesService extends MoleculerService {
	responseApi: any | Array<object>;
	returnResponse: object;
	indexName = 'flow-senior';
	isCode = '200';
	originLayer = 'integration';
	serviceName = 'ListingBranchesService';

	public constructor(public broker: ServiceBroker) {
		super(broker);
	}

	@Event({
		name: 'senior.gupy.integration.get.listingbranch',
		group: 'flow-senior'
	})
	public async GetListingBranchesSeniorGupy(
		gupySeniorListingBranch: IListingBranchesSeniorGupy
	) {
		try {
			const controllerBranches = new ListingBranchesController();

			const emitMessage = await controllerBranches.GetBranchesId(
				gupySeniorListingBranch
			);

			this.responseApi = await this.broker.emit(
				'senior.gupy.jobbranchs',
				emitMessage
			);

			loggerElastic(
				this.indexName,
				this.isCode,
				this.originLayer,
				this.serviceName,
				JSON.stringify(gupySeniorListingBranch),
				JSON.stringify(this.responseApi)
			);

			this.responseApi.forEach((respRoute: object) => {
				this.returnResponse = respRoute;
			});

			loggerElastic(
				this.indexName,
				this.isCode,
				this.originLayer,
				this.serviceName,
				JSON.stringify(gupySeniorListingBranch),
				JSON.stringify(this.returnResponse)
			);

			return this.returnResponse;
		} catch (error) {
			loggerElastic(
				this.indexName,
				'499',
				this.originLayer,
				this.serviceName,
				JSON.stringify(gupySeniorListingBranch),
				JSON.stringify(error.message)
			);

			apmElasticConnect
				.setTransactionName(this.indexName)
				.captureError(new Error(error.message))
				.endTransaction([error]);
		}
	}
}
