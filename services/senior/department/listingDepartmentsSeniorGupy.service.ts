('use strict');

import {
	Context,
	Errors,
	Service as MoleculerService,
	ServiceBroker
} from 'moleculer';
import {
	IListingDepartmentsSeniorGupy,
	TListingDepartmentsSeniorGupy
} from '../../../src/interface/senior/departament/listingDepartmentsSeniorGupy';
import { apmElasticConnect, loggerElastic } from '../../library/elasticSearch';

export default class ListingDepartmentsService extends MoleculerService {
	responseApi: any | Array<object>;
	returnResponse: object;
	indexName = 'flow-senior';
	isCode = '200';
	originLayer = 'senior';
	serviceName = 'ListingDepartmentsService';

	public constructor(public broker: ServiceBroker) {
		super(broker);
		this.parseServiceSchema({
			name: 'senior.gupy.listingdepartments',
			group: 'flow-senior',
			actions: {
				create: {
					cache: false,
					rest: {
						method: 'GET',
						basePath: 'senior',
						path: '/gupy/listingdepartments'
					},
					async handler(
						gupySeniorListingDepartment: Context<IListingDepartmentsSeniorGupy>
					) {
						const setResponse: TListingDepartmentsSeniorGupy =
							await this.GeTListingDepartmentsSeniorGupy(
								gupySeniorListingDepartment
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

	public async GeTListingDepartmentsSeniorGupy(
		gupySeniorListingDepartment: Context<IListingDepartmentsSeniorGupy>
	) {
		try {
			apmElasticConnect.startTransaction(this.indexName, 'string');

			const emitMessage = gupySeniorListingDepartment.params;

			this.responseApi = await this.broker.emit(
				'senior.gupy.integration.get.listingdepartment',
				emitMessage
			);

			loggerElastic(
				this.indexName,
				this.isCode,
				this.originLayer,
				this.serviceName,
				JSON.stringify(gupySeniorListingDepartment.params),
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
				JSON.stringify(gupySeniorListingDepartment.params),
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
				JSON.stringify(gupySeniorListingDepartment.params),
				JSON.stringify(error.message)
			);

			apmElasticConnect
				.setTransactionName(this.indexName)
				.captureError(new Error(error.message))
				.endTransaction([error]);
		}
	}
}
