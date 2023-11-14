('use strict');

import { Service as MoleculerService, ServiceBroker } from 'moleculer';
import { Event, Service } from 'moleculer-decorators';
import ListingRolesController from '../../../src/controller/senior/role/listingRolesSeniorGupy.controller';
import { IListingRolesSeniorGupy } from '../../../src/interface/senior/role/listingRolesSeniorGupy.interface';
import { apmElasticConnect, loggerElastic } from '../../library/elasticSearch';

@Service({
	name: 'senior.gupy.integration.listingroles',
	group: 'flow-senior'
})
export default class ListingRolesService extends MoleculerService {
	responseApi: any | Array<object>;
	returnResponse: object;
	indexName = 'flow-senior';
	isCode = '200';
	originLayer = 'integration';
	serviceName = 'ListingRolesService';

	public constructor(public broker: ServiceBroker) {
		super(broker);
	}

	@Event({
		name: 'senior.gupy.integration.get.listingrole',
		group: 'flow-senior'
	})
	public async GetListingRolesSeniorGupy(
		gupySeniorListingRole: IListingRolesSeniorGupy
	) {
		try {
			const controllerRoles = new ListingRolesController();

			const emitMessage = await controllerRoles.GetRolesId(
				gupySeniorListingRole
			);

			this.responseApi = await this.broker.emit(
				'senior.gupy.jobroles',
				emitMessage
			);

			loggerElastic(
				this.indexName,
				this.isCode,
				this.originLayer,
				this.serviceName,
				JSON.stringify(gupySeniorListingRole),
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
				JSON.stringify(gupySeniorListingRole),
				JSON.stringify(this.returnResponse)
			);

			return this.returnResponse;
		} catch (error) {
			loggerElastic(
				this.indexName,
				'499',
				this.originLayer,
				this.serviceName,
				JSON.stringify(gupySeniorListingRole),
				JSON.stringify(error.message)
			);

			apmElasticConnect
				.setTransactionName(this.indexName)
				.captureError(new Error(error.message))
				.endTransaction([error]);
		}
	}
}
