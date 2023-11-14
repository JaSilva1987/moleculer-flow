('use strict');

import {
	Context,
	Errors,
	Service as MoleculerService,
	ServiceBroker
} from 'moleculer';
import {
	IListingRolesSeniorGupy,
	TListingRolesSeniorGupy
} from '../../../src/interface/senior/role/listingRolesSeniorGupy.interface';
import { apmElasticConnect, loggerElastic } from '../../library/elasticSearch';

export default class ListingRolesService extends MoleculerService {
	responseApi: any | Array<object>;
	returnResponse: object;
	indexName = 'flow-senior';
	isCode = '200';
	originLayer = 'senior';
	serviceName = 'ListingRolesService';

	public constructor(public broker: ServiceBroker) {
		super(broker);
		this.parseServiceSchema({
			name: 'senior.gupy.listingroles',
			group: 'flow-senior',
			actions: {
				create: {
					cache: false,
					rest: {
						method: 'GET',
						basePath: 'senior',
						path: '/gupy/listingroles'
					},
					async handler(
						gupySeniorListingRole: Context<IListingRolesSeniorGupy>
					) {
						const setResponse: TListingRolesSeniorGupy =
							await this.GetListingRolesSeniorGupy(
								gupySeniorListingRole
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

	public async GetListingRolesSeniorGupy(
		gupySeniorListingRole: Context<IListingRolesSeniorGupy>
	) {
		try {
			apmElasticConnect.startTransaction(this.indexName, 'string');

			const emitMessage = gupySeniorListingRole.params;

			this.responseApi = await this.broker.emit(
				'senior.gupy.integration.get.listingrole',
				emitMessage
			);

			loggerElastic(
				this.indexName,
				this.isCode,
				this.originLayer,
				this.serviceName,
				JSON.stringify(gupySeniorListingRole.params),
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
				JSON.stringify(gupySeniorListingRole.params),
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
				JSON.stringify(gupySeniorListingRole.params),
				JSON.stringify(error.message)
			);

			apmElasticConnect
				.setTransactionName(this.indexName)
				.captureError(new Error(error.message))
				.endTransaction([error]);
		}
	}
}
