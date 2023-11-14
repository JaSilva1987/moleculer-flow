('use strict');

import * as dotenv from 'dotenv';
import { Service as MoleculerService, ServiceBroker } from 'moleculer';
import { Event, Service } from 'moleculer-decorators';
import { TSeniorUnico } from '../../../src/enum/senior/enum';
import {
	IGenerateServiceOauth2,
	IGenerateToken,
	IReturnToken
} from '../../../src/interface/senior/auth/autenticationToken.interface';
import {
	IControllerUnico,
	ISeniorUnico
} from '../../../src/interface/senior/job/createJobSeniorUnico.interface';
import { axiosInterceptors } from '../../library/axios/axiosInterceptos';
import { loggerElastic } from '../../library/elasticSearch';

dotenv.config();

@Service({
	name: 'senior.unico.createjob',
	group: 'flow-senior'
})
export default class CreateJobUnicoService extends MoleculerService {
	returnResponse: object;
	indexName = 'flow-senior';
	isCode = '200';
	originLayer = 'unico';
	serviceName = 'CreateJobUnicoService';

	public constructor(public broker: ServiceBroker) {
		super(broker);
	}

	@Event({
		name: 'senior.unico.post.createjob',
		group: 'flow-senior'
	})
	public async PostCreateJobSeniorUnico(
		unicoSerniorCreate: IControllerUnico
	) {
		try {
			this.logger.info(
				'============== RECEBENDO DADOS PARA CADASTRO POSIÇÃO - UNICO PEOPLE =============='
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

			this.logger.info(
				'============== INICIANDO O PROCESSO DE VALIDAÇÃO E GERAÇÃO DE TOKEN - UNICO PEOPLE =============='
			);

			const sendAuth: any = await this.broker.emit(
				'library.oauth2',
				generateAuth
			);

			const setMessageToken: IReturnToken = sendAuth.shift();
			const generateToken: IGenerateToken = setMessageToken.message;

			if (generateToken.access_token) {
				this.logger.info(
					'============== INICIANDO O ENVIO PARA UNICO CADASTRO POSIÇÕES - UNICO PEOPLE =============='
				);

				const dataBody: ISeniorUnico = JSON.parse(
					JSON.stringify(unicoSerniorCreate.message)
				);
				const objRequest = {
					objtRequest: {
						method: 'POST',
						maxBodyLength: Infinity,
						url:
							process.env.SENIOR_UNICO_URL_BASE +
							'account/' +
							unicoSerniorCreate.unit +
							'/json/position',
						headers: {
							Authorization:
								'Bearer ' + generateToken.access_token,
							'Content-Type': 'application/json'
						},
						data: JSON.stringify(dataBody)
					}
				};

				this.logger.info(
					'============== MONTAGEM REQUISIÇÃO PARA ENVIO DE CADASTRO DE POSIÇÕES - UNICO PEOPLE ==============\n' +
						objRequest.objtRequest.data
				);

				const sendUnico = await axiosInterceptors(objRequest);

				loggerElastic(
					this.indexName,
					this.isCode,
					this.originLayer,
					this.serviceName,
					JSON.stringify(unicoSerniorCreate),
					JSON.stringify(this.returnResponse)
				);

				this.logger.info(
					'============== RETORNO CADASTRO DE POSIÇÕES - UNICO PEOPLE ==============\n' +
						JSON.stringify(sendUnico)
				);

				switch (sendUnico) {
					case TSeniorUnico.isOk:
						this.returnResponse = {
							status: 200,
							message: sendUnico
						};
						break;
					case TSeniorUnico.isTimeout:
					case TSeniorUnico.noDepartament:
					case TSeniorUnico.noRoles:
						const retryUnico = await axiosInterceptors(objRequest);
						if (retryUnico === TSeniorUnico.isOk) {
							this.returnResponse = {
								status: 200,
								message: sendUnico
							};
						} else {
							this.returnResponse = {
								status: 504,
								message: TSeniorUnico.messageTimeout
							};
						}
						break;
					default:
						this.returnResponse = {
							status: 400,
							message: sendUnico
						};
						break;
				}

				return this.returnResponse;
			} else {
				loggerElastic(
					this.indexName,
					this.isCode,
					this.originLayer,
					this.serviceName,
					JSON.stringify(unicoSerniorCreate),
					JSON.stringify('Body token: ' + generateAuth) +
						' Return token: ' +
						sendAuth
				);
			}

			return {
				status: 401,
				message: TSeniorUnico.noAuth
			};
		} catch (error) {
			this.logger.warn(
				'============== ERRO NO PROCESSO DE ENVIO PARA UNICO CADASTRO POSIÇÕES - UNICO PEOPLE ==============\n' +
					JSON.stringify(error, null, 2)
			);

			loggerElastic(
				this.indexName,
				'499',
				this.originLayer,
				this.serviceName,
				JSON.stringify(unicoSerniorCreate),
				JSON.stringify(error.message)
			);
		}
	}
}
