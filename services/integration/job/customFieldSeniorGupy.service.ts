('use strict');

import { Service as MoleculerService, ServiceBroker } from 'moleculer';
import { Event, Service } from 'moleculer-decorators';
import CustomFieldsController from '../../../src/controller/senior/fields/customFieldsSeniorGupy.controller';
import { ICustomFieldsSeniorGupy } from '../../../src/interface/senior/job/customFieldsSeniorGupy.interface';
import { apmElasticConnect, loggerElastic } from '../../library/elasticSearch';

@Service({
	name: 'senior.gupy.integration.customfields',
	group: 'flow-senior'
})
export default class CustomFieldsService extends MoleculerService {
	responseApi: any | Array<object>;
	returnResponse: object;
	indexName = 'flow-senior';
	isCode = '200';
	originLayer = 'integration';
	serviceName = 'CustomFieldsService';

	public constructor(public broker: ServiceBroker) {
		super(broker);
	}

	@Event({
		name: 'senior.gupy.integration.get.customfields',
		group: 'flow-senior'
	})
	public async GetCustomFieldsSeniorGupy(
		customFieldsSeniorGupy: ICustomFieldsSeniorGupy
	) {
		try {
			const controllerCustomField = new CustomFieldsController();
			const emitMessage =
				await controllerCustomField.GetCustomFieldsSeniorGupy(
					customFieldsSeniorGupy
				);
			this.responseApi = await this.broker.emit(
				'senior.gupy.jobcustomfields',
				emitMessage
			);

			loggerElastic(
				this.indexName,
				this.isCode,
				this.originLayer,
				this.serviceName,
				JSON.stringify(customFieldsSeniorGupy),
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
				JSON.stringify(customFieldsSeniorGupy),
				JSON.stringify(this.returnResponse)
			);

			return this.returnResponse;
		} catch (error) {
			loggerElastic(
				this.indexName,
				'499',
				this.originLayer,
				this.serviceName,
				JSON.stringify(customFieldsSeniorGupy),
				JSON.stringify(error.message)
			);

			apmElasticConnect
				.setTransactionName(this.indexName)
				.captureError(new Error(error.message))
				.endTransaction([error]);
		}
	}
}
