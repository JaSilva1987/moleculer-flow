('use strict');

import {
	Context,
	Errors,
	Service as MoleculerService,
	ServiceBroker
} from 'moleculer';
import {
	ICustomFieldsSeniorGupy,
	TCreateJobSeniorGupy
} from '../../../src/interface/senior/job/customFieldsSeniorGupy.interface';
import { apmElasticConnect, loggerElastic } from '../../library/elasticSearch';

export default class CustomFieldsService extends MoleculerService {
	responseApi: any | Array<object>;
	returnResponse: object;
	indexName = 'flow-senior';
	isCode = '200';
	originLayer = 'senior';
	serviceName = 'CustomFieldsService';

	public constructor(public broker: ServiceBroker) {
		super(broker);
		this.parseServiceSchema({
			name: 'senior.gupy.customfields',
			group: 'flow-senior',
			actions: {
				create: {
					cache: false,
					rest: {
						method: 'GET',
						basePath: 'senior',
						path: '/gupy/customfields'
					},
					async handler(
						customFieldsSeniorGupy: Context<ICustomFieldsSeniorGupy>
					) {
						const setResponse: TCreateJobSeniorGupy =
							await this.GetCustomFieldsSeniorGupy(
								customFieldsSeniorGupy
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

	public async GetCustomFieldsSeniorGupy(
		customFieldsSeniorGupy: Context<ICustomFieldsSeniorGupy>
	) {
		try {
			apmElasticConnect.startTransaction(this.indexName, 'string');

			const emitMessage = customFieldsSeniorGupy.params;

			this.responseApi = await this.broker.emit(
				'senior.gupy.integration.get.customfields',
				emitMessage
			);

			loggerElastic(
				this.indexName,
				this.isCode,
				this.originLayer,
				this.serviceName,
				JSON.stringify(customFieldsSeniorGupy.params),
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
				JSON.stringify(customFieldsSeniorGupy.params),
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
				JSON.stringify(customFieldsSeniorGupy.params),
				JSON.stringify(error.message)
			);

			apmElasticConnect
				.setTransactionName(this.indexName)
				.captureError(new Error(error.message))
				.endTransaction([error]);
		}
	}
}
