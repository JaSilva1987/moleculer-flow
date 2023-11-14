('use strict');

import {
	Context,
	Errors,
	Service as MoleculerService,
	ServiceBroker
} from 'moleculer';
import {
	StatusCodeExpedLog,
	TreatmentExpedLog
} from '../../../src/enum/expedLog/enum';
import {
	IExpedLogReturn,
	IResponseExpedLog,
	ITokenExpedLog
} from '../../../src/interface/expedLog/expedLog.interface';
import { validatorFactory } from '../../../src/validator/validator';
import { loggerElastic } from '../../library/elasticSearch';
import ExpedLogRequests from '../../../src/controller/expedlog/requestsExpedLog.controller';
import { INewDevolutionExpedLog } from '../../../src/interface/expedLog/newDevolution.interface';
import {
	DevolutionCollectionStatusExpedLogSchema,
	NewDevolutionExpedLogSchema,
	devolutionCollectionStatusExpedLogSchemaType,
	newDevolutionExpedLogSchemaType
} from '../../../src/validator/expedLog/devolution/devolutionExpedLog.validator';
import { IDevolutionCollectionStatus } from '../../../src/interface/expedLog/devolutionCollectionStatus.interface';
import { connectionIntegrador } from '../../../src/data-source';
import { DevolutionExpedLog } from '../../../src/entity/integration/devolutionExpedLog.entity';

export default class DevolutionsExpedLog extends MoleculerService {
	indexName = 'flow-expedlog';
	isCode = '200';
	errCode = '499';
	originLayer = 'expedlog';
	serviceNamePost = 'DevolutionServicePost';
	responseReturn: any | IResponseExpedLog;
	responseApi: any | IResponseExpedLog;
	newDevolutionUrl: string = process.env.EXPEDLOG_NEW_DEVOLUTION_URL;

	public constructor(broker: ServiceBroker) {
		super(broker);

		this.parseServiceSchema({
			name: 'expedlog-devolution',
			group: 'flow-expedlog',
			actions: {
				newDevolution: {
					cache: false,
					rest: {
						method: 'POST',
						basePath: 'expedlog',
						path: '/new-devolution/'
					},
					async handler(
						expedLogCtx: Context<INewDevolutionExpedLog>
					): Promise<IResponseExpedLog> {
						return await this.NewDevolutionPost(expedLogCtx);
					}
				},
				devolutionCollectionStatus: {
					cache: false,
					rest: {
						method: 'POST',
						basePath: 'expedlog',
						path: '/devolution-collection-status/'
					},
					async handler(
						expedLogCtx: Context<IDevolutionCollectionStatus>
					): Promise<IResponseExpedLog> {
						return await this.StoreDevolutionData(expedLogCtx);
					}
				}
			}
		});
	}

	public async NewDevolutionPost(
		expedLogCtx: Context<INewDevolutionExpedLog>
	) {
		const expedLogParams =
			expedLogCtx.params as newDevolutionExpedLogSchemaType;
		const validation = validatorFactory<newDevolutionExpedLogSchemaType>(
			NewDevolutionExpedLogSchema
		);
		const validateJson = validation.verify(expedLogParams);

		if (validateJson) {
			const expedLogController = new ExpedLogRequests();
			const responseToken: ITokenExpedLog =
				await expedLogController.ExpedLogRequestsToken(expedLogParams);

			if (responseToken.token) {
				const expedLogRequest =
					await expedLogController.ExpedLogRequests(
						expedLogParams,
						responseToken.token,
						this.newDevolutionUrl
					);

				this.responseReturn = expedLogRequest;
			} else {
				return {
					code: StatusCodeExpedLog.noToken,
					message: TreatmentExpedLog.noToken,
					detailedMessage: TreatmentExpedLog.detailToken
				};
			}
		} else {
			this.responseReturn = {
				code: StatusCodeExpedLog.validationJson,
				message: TreatmentExpedLog.inconsistency,
				detailedMessage: TreatmentExpedLog.jsonFormat
			};
		}

		const validReturn: IExpedLogReturn = this.responseReturn;

		loggerElastic(
			this.indexName,
			this.isCode,
			this.originLayer,
			this.serviceNamePost,
			JSON.stringify(expedLogCtx.params),
			JSON.stringify(validReturn)
		);

		if (validReturn.status == 200) {
			return await Promise.resolve(validReturn);
		} else {
			return await Promise.reject(
				new Errors.MoleculerError(
					validReturn.message ||
						validReturn.detailedMessage ||
						String(validReturn),
					+validReturn.status || +validReturn.code || 400
				)
			);
		}
	}

	public async StoreDevolutionData(expedLogCtx: Context<any>) {
		try {
			const expedLogDevolutionParams = Object.values(expedLogCtx.params);

			if (!Array.isArray(expedLogDevolutionParams) || !expedLogDevolutionParams.length)
				throw {
					status: StatusCodeExpedLog.validationJson,
					message: `${TreatmentExpedLog.inconsistency} - ${TreatmentExpedLog.arrayExpected}`,
					detailedMessage: TreatmentExpedLog.arrayExpected
				};

			const validation =
				validatorFactory<devolutionCollectionStatusExpedLogSchemaType>(
					DevolutionCollectionStatusExpedLogSchema
				);

			loggerElastic(
				this.indexName,
				this.isCode,
				this.originLayer,
				this.serviceNamePost,
				JSON.stringify(expedLogDevolutionParams)
			);

			expedLogDevolutionParams.forEach((expedLog: any) => {
				const bodyReceived =
					expedLog as devolutionCollectionStatusExpedLogSchemaType;
				const validateJson = validation.verify(bodyReceived);
				if (!validateJson)
					throw {
						code: StatusCodeExpedLog.validationJson,
						message: `${TreatmentExpedLog.inconsistency} - ${TreatmentExpedLog.jsonFormat}`,
						detailedMessage: TreatmentExpedLog.jsonFormat
					};
			});

			expedLogDevolutionParams.forEach(
				async (expedLog: IDevolutionCollectionStatus) => {
					const devolutionSaveObj = {
						receivedBody: JSON.stringify(expedLog),
						companyIdentifier: expedLog.cnpjEmpresa,
						companyName: expedLog.nomeEmpresa
					};
					const devolutionSaved = await connectionIntegrador
						.getRepository(DevolutionExpedLog)
						.save(devolutionSaveObj);
					if (!devolutionSaved)
						throw {
							status: StatusCodeExpedLog.databaseError,
							message: TreatmentExpedLog.inconsistency,
							detailedMessage: TreatmentExpedLog.databaseError
						};
				}
			);

			return await Promise.resolve({
				status: +StatusCodeExpedLog.success,
				message: TreatmentExpedLog.success,
				detailedMessage: TreatmentExpedLog.devolutionDataReceived
			});
		} catch (error) {
			return await Promise.reject(
				new Errors.MoleculerError(
					error.message || error.detailedMessage || error,
					+error.code || +error.status || 400
				)
			);
		}
	}
}
