('use strict');

import {
	Context,
	Errors,
	Service as MoleculerService,
	ServiceBroker
} from 'moleculer';
import {
	IListingBranchesSeniorGupy,
	TListingBranchesSeniorGupy
} from '../../../src/interface/senior/branch/listingBranchesSeniorGupy.interface';
import { apmElasticConnect, loggerElastic } from '../../library/elasticSearch';

export default class ListingBranchesService extends MoleculerService {
	responseApi: any | Array<object>;
	returnResponse: object;
	indexName = 'flow-senior';
	isCode = '200';
	originLayer = 'senior';
	serviceName = 'ListingBranchesService';

	public constructor(public broker: ServiceBroker) {
		super(broker);
		this.parseServiceSchema({
			name: 'senior.gupy.listingbranches',
			group: 'flow-senior',
			actions: {
				create: {
					cache: false,
					rest: {
						method: 'GET',
						basePath: 'senior',
						path: '/gupy/listingbranches'
					},
					async handler(
						gupySeniorListingBranch: Context<IListingBranchesSeniorGupy>
					) {
						const setResponse: TListingBranchesSeniorGupy =
							await this.GetListingBranchesSeniorGupy(
								gupySeniorListingBranch
							);
						if (setResponse.status > 400) {
							return await Promise.reject(
								new Errors.MoleculerError(
									JSON.parse(JSON.stringify(setResponse)),
									setResponse.status != undefined &&
									typeof 'number'
										? setResponse.status
										: 499
								)
							);
						} else {
							return await Promise.resolve(setResponse);
						}
					}
				}
			}
		});
	}

	public async GetListingBranchesSeniorGupy(
		gupySeniorListingBranch: Context<IListingBranchesSeniorGupy>
	) {
		try {
			apmElasticConnect.startTransaction(this.indexName, 'string');

			const emitMessage = gupySeniorListingBranch.params;

			this.responseApi = await this.broker.emit(
				'senior.gupy.integration.get.listingbranch',
				emitMessage
			);

			loggerElastic(
				this.indexName,
				this.isCode,
				this.originLayer,
				this.serviceName,
				JSON.stringify(gupySeniorListingBranch.params),
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
				JSON.stringify(gupySeniorListingBranch.params),
				JSON.stringify(this.returnResponse)
			);

			apmElasticConnect.endTransaction([this.returnResponse]);

			return this.returnResponse;
		} catch (error) {
			loggerElastic(
				this.indexName,
				'499',
				this.originLayer,
				this.serviceName,
				JSON.stringify(gupySeniorListingBranch.params),
				JSON.stringify(error.message)
			);

			apmElasticConnect
				.setTransactionName(this.indexName)
				.captureError(new Error(error.message))
				.endTransaction([error]);
		}
	}
}
