('use strict');

import { Service as MoleculerService, ServiceBroker } from 'moleculer';
import { Event, Service } from 'moleculer-decorators';
import ListingDepartmentsController from '../../../src/controller/senior/department/listingDepartmentsSeniorGupy.controller';
import { IListingDepartmentsSeniorGupy } from '../../../src/interface/senior/departament/listingDepartmentsSeniorGupy';
import { apmElasticConnect, loggerElastic } from '../../library/elasticSearch';

@Service({
	name: 'senior.gupy.integration.listingdepartments',
	group: 'flow-senior'
})
export default class ListingDepartmentsService extends MoleculerService {
	responseApi: any | Array<object>;
	returnResponse: object;
	indexName = 'flow-senior';
	isCode = '200';
	originLayer = 'integration';
	serviceName = 'ListingDepartmentsService';

	public constructor(public broker: ServiceBroker) {
		super(broker);
	}

	@Event({
		name: 'senior.gupy.integration.get.listingdepartment',
		group: 'flow-senior'
	})
	public async GetListingDepartmentsSeniorGupy(
		gupySeniorListingDepartment: IListingDepartmentsSeniorGupy
	) {
		try {
			const controllerDepartaments = new ListingDepartmentsController();
			const emitMessage =
				await controllerDepartaments.GetDepartmentsSeniorGupy(
					gupySeniorListingDepartment
				);
			this.responseApi = await this.broker.emit(
				'senior.gupy.jobdepartaments',
				emitMessage
			);

			loggerElastic(
				this.indexName,
				this.isCode,
				this.originLayer,
				this.serviceName,
				JSON.stringify(gupySeniorListingDepartment),
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
				JSON.stringify(gupySeniorListingDepartment),
				JSON.stringify(this.returnResponse)
			);

			return this.returnResponse;
		} catch (error) {
			loggerElastic(
				this.indexName,
				'499',
				this.originLayer,
				this.serviceName,
				JSON.stringify(gupySeniorListingDepartment),
				JSON.stringify(error.message)
			);

			apmElasticConnect
				.setTransactionName(this.indexName)
				.captureError(new Error(error.message))
				.endTransaction([error]);
		}
	}
}
