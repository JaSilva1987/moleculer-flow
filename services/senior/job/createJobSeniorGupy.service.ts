('use strict');

import {
	Context,
	Errors,
	Service as MoleculerService,
	ServiceBroker
} from 'moleculer';
import {
	ICreateJobSeniorGupy,
	TCreateJobSeniorGupy
} from '../../../src/interface/senior/job/createJobSeniorGupy.interface';
import { apmElasticConnect, loggerElastic } from '../../library/elasticSearch';

export default class CreateJobService extends MoleculerService {
	responseApi: any | Array<object>;
	returnResponse: object;
	indexName = 'flow-senior';
	isCode = '200';
	originLayer = 'senior';
	serviceName = 'CreateJobService';

	public constructor(public broker: ServiceBroker) {
		super(broker);
		this.parseServiceSchema({
			name: 'senior.gupy.createjob',
			group: 'flow-senior',
			actions: {
				create: {
					cache: false,
					rest: {
						method: 'POST',
						basePath: 'senior',
						path: '/gupy/createjob'
					},
					params: {
						customFields: { type: 'array' },
						name: { type: 'string' },
						type: { type: 'string' },
						code: { type: 'string' },
						codeRole: { type: 'string' },
						codeBranch: { type: 'string' },
						codeDepartament: { type: 'string' },
						numVacancies: { type: 'number' },
						departmentId: { type: 'number' },
						departmentName: { type: 'string' },
						salary: { type: 'object' },
						roleId: { type: 'number' },
						branchId: { type: 'number' },
						branchName: { type: 'string' },
						similarRole: { type: 'string' },
						similardepartment: { type: 'string' },
						addressCountry: { type: 'string' },
						addressCountryShortName: { type: 'string' },
						addressState: { type: 'string' },
						addressStateShortName: { type: 'string' },
						addressCity: { type: 'string' },
						addressStreet: { type: 'string' },
						addressNumber: { type: 'string' },
						addressZipCode: { type: 'string' },
						publicationType: { type: 'string' },
						description: { type: 'string' },
						responsibilities: { type: 'string' },
						prerequisites: { type: 'string' },
						reason: { type: 'string' }
					},
					async handler(
						gupySerniorCreate: Context<ICreateJobSeniorGupy>
					) {
						const setResponse: TCreateJobSeniorGupy =
							await this.PostCreateJobSeniorGupy(
								gupySerniorCreate
							);
						if (setResponse.status >= 400) {
							return await Promise.reject(
								new Errors.MoleculerError(
									setResponse.message != undefined
										? JSON.parse(
												JSON.stringify(
													setResponse.message
												)
										  )
										: JSON.parse(
												JSON.stringify(
													setResponse.detail
												)
										  ),
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

	public async PostCreateJobSeniorGupy(
		gupySerniorCreate: Context<ICreateJobSeniorGupy>
	) {
		try {
			apmElasticConnect.startTransaction(this.indexName, 'string');

			const emitMessage = gupySerniorCreate.params;

			this.responseApi = await this.broker.emit(
				'senior.gupy.integration.post.createjob',
				emitMessage
			);

			loggerElastic(
				this.indexName,
				this.isCode,
				this.originLayer,
				this.serviceName,
				JSON.stringify(gupySerniorCreate.params),
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
				JSON.stringify(gupySerniorCreate.params),
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
				JSON.stringify(gupySerniorCreate.params),
				JSON.stringify(error.message)
			);

			apmElasticConnect
				.setTransactionName(this.indexName)
				.captureError(new Error(error.message))
				.endTransaction([error]);
		}
	}
}
