import { ServiceBroker } from 'moleculer';
import { axiosInterceptors } from '../../../../services/library/axios/axiosInterceptos';
import { loggerElastic } from '../../../../services/library/elasticSearch';
import { TSeniorUnico } from '../../../enum/senior/enum';
import {
	IGenerateServiceOauth2,
	IGenerateToken,
	IReturnToken
} from '../../../interface/senior/auth/autenticationToken.interface';
import {
	IDepartamentsUnico,
	IRoleUnico,
	ISeniorUnico
} from '../../../interface/senior/job/createJobSeniorUnico.interface';

export class CreateJobUnicoController {
	responseApi: any | Array<object>;
	returnResponse: any;
	roleValid: string;
	departamentValid: string;
	indexName = 'flow-senior';
	isCode = '200';
	originLayer = 'controller';
	serviceName = 'CreateJobUnicoController';

	public constructor(public broker: ServiceBroker) {
		this.broker;
	}

	public async checkJsonValid(unicoSerniorCreate: ISeniorUnico) {
		try {
			this.broker.logger.info(
				'============== INICIANDO O PROCESSO DE VALIDAÇÃO E GERAÇÃO DE TOKEN - UNICO PEOPLE =============='
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
				this.broker.logger.info(
					'============== INICIANDO O PROCESSO DE VALIDAÇÃO DEPARATAMENTOS E CARGOS - UNICO PEOPLE =============='
				);

				const getRole = {
					objtRequest: {
						method: 'GET',
						maxBodyLength: Infinity,
						url:
							process.env.SENIOR_UNICO_URL_BASE +
							'role/' +
							unicoSerniorCreate.organization,
						headers: {
							Authorization:
								'Bearer ' + generateToken.access_token,
							'Content-Type': 'application/json'
						},
						params: {
							code: unicoSerniorCreate.role
						}
					}
				};

				const returnRoles = await axiosInterceptors(getRole);

				loggerElastic(
					this.indexName,
					this.isCode,
					this.originLayer,
					this.serviceName,
					JSON.stringify(unicoSerniorCreate),
					JSON.stringify(returnRoles)
				);

				if (returnRoles.length > 0) {
					if (Array.isArray(returnRoles)) {
						this.broker.logger.info(
							'============== CARGO CONSULTADO JÁ EXISTE - UNICO PEOPLE =============='
						);

						const filterArr = returnRoles.filter(
							(isRole: IRoleUnico) =>
								isRole.code === unicoSerniorCreate.role
						);

						filterArr.forEach((isRole: IRoleUnico) => {
							this.roleValid = isRole.code;
						});
					} else {
						this.broker.logger.info(
							'============== RETRY CONSULTA CARGO - UNICO PEOPLE =============='
						);

						const retryUnico = await axiosInterceptors(getRole);
						if (
							retryUnico.length === 1 &&
							Array.isArray(retryUnico)
						) {
							this.broker.logger.info(
								'============== CARGO CONSULTADO JÁ EXISTE - UNICO PEOPLE =============='
							);

							const filterArr = retryUnico.filter(
								(isRole: IRoleUnico) =>
									isRole.code === unicoSerniorCreate.role
							);

							filterArr.forEach((isRole: IRoleUnico) => {
								this.roleValid = isRole.code;
							});
						} else {
							throw new Error(TSeniorUnico.messageTimeout);
						}
					}
				} else {
					this.broker.logger.info(
						'============== CARGO NÃO EXISTE - REALIZANDO O CADASTRO - UNICO PEOPLE =============='
					);

					const postRole = {
						objtRequest: {
							method: 'POST',
							maxBodyLength: Infinity,
							url:
								process.env.SENIOR_UNICO_URL_BASE +
								'role/json/' +
								unicoSerniorCreate.organization,
							headers: {
								Authorization:
									'Bearer ' + generateToken.access_token,
								'Content-Type': 'application/json'
							},
							data: JSON.stringify({
								code: unicoSerniorCreate.role,
								name: unicoSerniorCreate.roleName
							})
						}
					};
					const createRoles = await axiosInterceptors(postRole);

					if (
						Number(createRoles.code) === 201 ||
						Number(createRoles.code) === 200
					) {
						this.broker.logger.info(
							'============== CARGO CADASTRADO COM SUCESSO - UNICO PEOPLE =============='
						);

						this.roleValid = unicoSerniorCreate.role;
					} else {
						this.broker.logger.info(
							'============== ERRO AO CADASTRAR CARGO - UNICO PEOPLE =============='
						);

						throw new Error(TSeniorUnico.noDeparts);
					}
				}

				const getDepartaments = {
					objtRequest: {
						method: 'GET',
						maxBodyLength: Infinity,
						url:
							process.env.SENIOR_UNICO_URL_BASE +
							'department/' +
							unicoSerniorCreate.organization,
						headers: {
							Authorization:
								'Bearer ' + generateToken.access_token,
							'Content-Type': 'application/json'
						},
						params: {
							code: unicoSerniorCreate.department
						}
					}
				};

				const returnDeparts = await axiosInterceptors(getDepartaments);

				loggerElastic(
					this.indexName,
					this.isCode,
					this.originLayer,
					this.serviceName,
					JSON.stringify(unicoSerniorCreate),
					JSON.stringify(returnDeparts)
				);

				if (returnDeparts.length > 0) {
					if (Array.isArray(returnDeparts)) {
						this.broker.logger.info(
							'============== DEPARTAMENTO CONSULTADO JÁ EXISTE - UNICO PEOPLE =============='
						);

						const filterArr = returnDeparts.filter(
							(isDepartament: IDepartamentsUnico) =>
								isDepartament.code ===
								unicoSerniorCreate.department
						);

						filterArr.forEach(
							(isDepartament: IDepartamentsUnico) => {
								this.departamentValid = isDepartament.code;
							}
						);
					} else {
						this.broker.logger.info(
							'============== RETRY CONSULTA DEPARTAMENTO - UNICO PEOPLE =============='
						);

						const retryUnico = await axiosInterceptors(getRole);

						if (
							retryUnico.length === 1 &&
							Array.isArray(retryUnico)
						) {
							this.broker.logger.info(
								'============== DEPARTAMENTO CONSULTADO JÁ EXISTE - UNICO PEOPLE =============='
							);

							const filterArr = retryUnico.filter(
								(isDepartament: IDepartamentsUnico) =>
									isDepartament.code ===
									unicoSerniorCreate.department
							);

							filterArr.forEach(
								(isDepartament: IDepartamentsUnico) => {
									this.departamentValid = isDepartament.code;
								}
							);
						} else {
							throw new Error(TSeniorUnico.messageTimeout);
						}
					}
				} else {
					this.broker.logger.info(
						'============== DEPARATEMNTO NÃO EXISTE - REALIZANDO O CADASTRO - UNICO PEOPLE =============='
					);

					const postDeparts = {
						objtRequest: {
							method: 'POST',
							maxBodyLength: Infinity,
							url:
								process.env.SENIOR_UNICO_URL_BASE +
								'department/json/' +
								unicoSerniorCreate.organization,
							headers: {
								Authorization:
									'Bearer ' + generateToken.access_token,
								'Content-Type': 'application/json'
							},
							data: JSON.stringify({
								code: unicoSerniorCreate.department,
								name: unicoSerniorCreate.departmentName
							})
						}
					};
					const createDeparts = await axiosInterceptors(postDeparts);
					if (
						Number(createDeparts.code) === 201 ||
						Number(createDeparts.code) === 200
					) {
						this.broker.logger.info(
							'============== DEPARTAMENTO CADASTRADO COM SUCESSO - UNICO PEOPLE =============='
						);

						this.departamentValid = unicoSerniorCreate.department;
					} else {
						this.broker.logger.info(
							'============== ERRO AO CADASTRAR DEPARTAMENTO - UNICO PEOPLE =============='
						);

						throw new Error(TSeniorUnico.noRole);
					}
				}

				this.broker.logger.info(
					'============== MONTANDO JSON PARA CADASTRO DA POSIÇÃO - UNICO PEOPLE =============='
				);

				this.returnResponse = {
					status: 200,
					unit: unicoSerniorCreate.unit,
					message: {
						limit_date: unicoSerniorCreate.limit_date,

						role: this.roleValid,
						department: this.departamentValid,
						pagamento: unicoSerniorCreate.pagamento,
						deficiencia: unicoSerniorCreate.deficiencia,
						profile: unicoSerniorCreate.profile,
						send_sms: unicoSerniorCreate.send_sms,
						send_email: unicoSerniorCreate.send_email
					}
				};

				if (unicoSerniorCreate.num_matricula != undefined) {
					Object.assign(this.returnResponse.message, {
						num_matricula: unicoSerniorCreate.num_matricula
					});
				}

				if (unicoSerniorCreate.admission_date != undefined) {
					Object.assign(this.returnResponse.message, {
						admission_date: unicoSerniorCreate.admission_date
					});
				}

				if (unicoSerniorCreate.cost_center != undefined) {
					Object.assign(this.returnResponse.message, {
						cost_center: unicoSerniorCreate.cost_center
					});
				}

				if (unicoSerniorCreate.pos_number != undefined) {
					Object.assign(this.returnResponse.message, {
						pos_number: unicoSerniorCreate.pos_number
					});
				}

				if (unicoSerniorCreate.jornada != undefined) {
					Object.assign(this.returnResponse.message, {
						jornada: unicoSerniorCreate.jornada
					});
				}

				if (unicoSerniorCreate.exame != undefined) {
					Object.assign(this.returnResponse.message, {
						exame: unicoSerniorCreate.exame
					});
				}
				if (unicoSerniorCreate.docs != undefined) {
					Object.assign(this.returnResponse.message, {
						docs: unicoSerniorCreate.docs
					});
				}

				loggerElastic(
					this.indexName,
					this.isCode,
					this.originLayer,
					this.serviceName,
					JSON.stringify(unicoSerniorCreate),
					JSON.stringify(this.returnResponse)
				);
			} else {
				this.broker.logger.info(
					'============== FALHA NA GERAÇÃO DE TOKEN UNICO - UNICO PEOPLE =============='
				);

				this.returnResponse = {
					status: 401,
					message: TSeniorUnico.noAuth
				};
			}

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

			return this.returnResponse;
		} catch (error) {
			loggerElastic(
				this.indexName,
				this.isCode,
				this.originLayer,
				this.serviceName,
				JSON.stringify(unicoSerniorCreate),
				JSON.stringify('Erro: ' + error)
			);

			return {
				status: 499,
				message: error.message
			};
		}
	}
}
