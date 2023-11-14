('use strict');

import * as dotenv from 'dotenv';
import {
	Context,
	Errors,
	Service as MoleculerService,
	ServiceBroker
} from 'moleculer';
import { TSeniorGupy, TSeniorUnico } from '../../../src/enum/senior/enum';
import {
	IGenerateServiceOauth2,
	IGenerateToken,
	IReturnToken
} from '../../../src/interface/senior/auth/autenticationToken.interface';
import {
	IUnicoSenior,
	IUnicoStatus
} from '../../../src/interface/unico/createJobSeniorUnico.interface';
import { AxiosRequest } from '../../library/axios';
import { apmElasticConnect, loggerElastic } from '../../library/elasticSearch';

dotenv.config();

export default class CandidateHiredUnicoService extends MoleculerService {
	responseApi: any | Array<object>;
	returnResponse: object;
	indexName = 'flow-senior';
	isCode = '200';
	originLayer = 'gupy';
	serviceName = 'CandidateHiredService';

	public constructor(public broker: ServiceBroker) {
		super(broker);
		this.parseServiceSchema({
			name: 'unico.candidatehired',
			group: 'flow-senior',
			actions: {
				hired: {
					cache: false,
					rest: {
						method: 'POST',
						basePath: 'senior',
						path: '/unico/candidatehired'
					},
					params: {
						integration: { type: 'string' },
						position: { type: 'string' },
						'position-number': { type: 'string' },
						unit: { type: 'string' },
						event: { type: 'string' }
					},
					async handler(
						unicoSerniorCandidate: Context<IUnicoSenior>
					) {
						const setResponse =
							await this.PostCandidateHiredSeniorUnico(
								unicoSerniorCandidate
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

	public async PostCandidateHiredSeniorUnico(
		unicoSerniorCandidate: Context<IUnicoSenior>
	) {
		try {
			apmElasticConnect.startTransaction(this.indexName, 'string');

			const emitMessage: IUnicoSenior = unicoSerniorCandidate.params;

			this.logger.info(
				'============================= RECEBENDO DADOS WEBHOOK - UNICO PEOPLE ==========================\n' +
					JSON.stringify(emitMessage, null, 2)
			);

			const generateAuth: IGenerateServiceOauth2 = {
				serviceAccount: process.env.SENIOR_UNICO_ACCOUNT,
				tenant: process.env.SENIOR_UNICO_TENANT,
				account: '',
				basePath: process.env.SENIOR_UNICO_URL_AUTH,
				cert: process.env.SENIOR_UNICO_CERT,
				iss: process.env.SENIOR_UNICO_ISS,
				params: process.env.SENIOR_PARAMS_TOKEN,
				grantType: process.env.SENIOR_UNICO_GRANT
			};

			const sendAuth: any = await this.broker.emit(
				'library.oauth2',
				generateAuth
			);

			const setMessageToken: IReturnToken = sendAuth.shift();
			const generateToken: IGenerateToken = setMessageToken.message;

			if (generateToken.access_token) {
				this.logger.info(
					'============================= BUSCANDO DADOS VIA GET POSITIONS - UNICO PEOPLE =========================='
				);

				const objRequest = {
					method: 'GET',
					maxBodyLength: Infinity,
					url:
						process.env.SENIOR_UNICO_URL_BASE +
						'positions/' +
						emitMessage.position +
						'?includes=role,benefits,department,persons,unit',
					headers: {
						Authorization: 'Bearer ' + generateToken.access_token,
						'Content-Type': 'application/json'
					}
				};

				this.returnResponse = await AxiosRequest(objRequest);

				const returnUnico: IUnicoStatus = JSON.parse(
					JSON.stringify(this.returnResponse)
				);

				if (returnUnico.status === 200) {
					this.logger.info(
						'============================= RECEBENDO DADOS WEBHOOK - UNICO PEOPLE ==========================\n' +
							JSON.stringify(this.returnResponse, null, 2)
					);

					this.responseApi = await this.broker.emit(
						'senior.unico.integration.post.candidatehired',
						returnUnico
					);

					loggerElastic(
						this.indexName,
						this.isCode,
						this.originLayer,
						this.serviceName,
						JSON.stringify(unicoSerniorCandidate.params),
						JSON.stringify(this.responseApi)
					);

					this.responseApi.forEach((respRoute: object) => {
						this.returnResponse = respRoute;
					});
				} else {
					this.returnResponse = {
						status: 400,
						message: TSeniorUnico.noGetPositions
					};
				}
			} else {
				this.returnResponse = {
					status: 401,
					message: TSeniorUnico.noAuth
				};

				loggerElastic(
					this.indexName,
					this.isCode,
					this.originLayer,
					this.serviceName,
					JSON.stringify(unicoSerniorCandidate.params),
					JSON.stringify(this.returnResponse)
				);
			}

			apmElasticConnect.endTransaction([this.returnResponse]);

			return this.returnResponse;
		} catch (error) {
			loggerElastic(
				this.indexName,
				'499',
				this.originLayer,
				this.serviceName,
				JSON.stringify(unicoSerniorCandidate.params),
				JSON.stringify(error.message)
			);

			apmElasticConnect
				.setTransactionName(this.indexName)
				.captureError(new Error(error.message))
				.endTransaction([error]);
		}
	}
}
