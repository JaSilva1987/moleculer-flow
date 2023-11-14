('use strict');

import * as dotenv from 'dotenv';
import {
	Context,
	Errors,
	Service as MoleculerService,
	ServiceBroker
} from 'moleculer';
import { TSeniorGupy } from '../../../src/enum/senior/enum';
import { ICandidateHiredSeniorGupy } from '../../../src/interface/gupy/candidate/candidateHiredSeniorGupy.interface';
import { apmElasticConnect, loggerElastic } from '../../library/elasticSearch';
dotenv.config();

export default class CandidateHiredService extends MoleculerService {
	responseApi: any | Array<object>;
	returnResponse: object;
	indexName = 'flow-senior';
	isCode = '200';
	originLayer = 'gupy';
	serviceName = 'CandidateHiredService';

	public constructor(public broker: ServiceBroker) {
		super(broker);
		this.parseServiceSchema({
			name: 'senior.gupy.candidatehired',
			group: 'flow-senior',
			actions: {
				hired: {
					cache: false,
					rest: {
						method: 'POST',
						basePath: 'senior',
						path: '/gupy/candidatehired'
					},
					async handler(
						gupySerniorCandidate: Context<ICandidateHiredSeniorGupy>
					) {
						const setResponse =
							await this.PostCandidateHiredSeniorGupy(
								gupySerniorCandidate
							);

						if (setResponse.status != TSeniorGupy.notFound) {
							return await Promise.resolve(setResponse);
						} else {
							return await Promise.reject(
								new Errors.MoleculerError(
									JSON.parse(
										JSON.stringify(setResponse.erroExecucao)
									),
									400
								)
							);
						}
					}
				}
			}
		});
	}

	public async PostCandidateHiredSeniorGupy(
		gupySerniorCandidate: Context<ICandidateHiredSeniorGupy>
	) {
		try {
			apmElasticConnect.startTransaction(this.indexName, 'string');

			const emitMessage = gupySerniorCandidate.params;

			this.responseApi = await this.broker.emit(
				'senior.gupy.integration.post.candidatehired',
				emitMessage
			);

			loggerElastic(
				this.indexName,
				this.isCode,
				this.originLayer,
				this.serviceName,
				JSON.stringify(gupySerniorCandidate.params),
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
				JSON.stringify(gupySerniorCandidate.params),
				JSON.stringify(this.returnResponse)
			);

			apmElasticConnect.endTransaction([this.returnResponse]);

			if (
				this.returnResponse != undefined ||
				String(this.returnResponse) != TSeniorGupy.intercPt
			) {
				return this.returnResponse;
			} else {
				return {
					erroExecucao: {
						'xsi:nil': Boolean(TSeniorGupy.xsiNil),
						'xmlns:xsi': TSeniorGupy.xmlnsXsi
					},
					status: TSeniorGupy.notFound
				};
			}
		} catch (error) {
			loggerElastic(
				this.indexName,
				'499',
				this.originLayer,
				this.serviceName,
				JSON.stringify(gupySerniorCandidate.params),
				JSON.stringify(error.message)
			);

			apmElasticConnect
				.setTransactionName(this.indexName)
				.captureError(new Error(error.message))
				.endTransaction([error]);
		}
	}
}
