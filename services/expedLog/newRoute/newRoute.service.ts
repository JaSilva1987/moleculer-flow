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
import {
	NewRouteExpedLogSchema,
	newRouteExpedLogSchemaType
} from '../../../src/validator/expedLog/route/routeExpedLog.validator';
import ExpedLogRequests from '../../../src/controller/expedlog/requestsExpedLog.controller';
import { INewRouteExpedLog } from '../../../src/interface/expedLog/newRoute.interface';

export default class RouteExpedLog extends MoleculerService {
	indexName = 'flow-expedlog';
	isCode = '200';
	errCode = '499';
	originLayer = 'expedlog';
	serviceNamePost = 'NewRouteServicePost';
	responseReturn: any | IResponseExpedLog;
	responseApi: any | IResponseExpedLog;
	url: string = process.env.EXPEDLOG_NEW_ROUTE_URL;

	public constructor(broker: ServiceBroker) {
		super(broker);

		this.parseServiceSchema({
			name: 'expedlog-new-route',
			group: 'flow-expedlog',
			actions: {
				post: {
					cache: false,
					rest: {
						method: 'POST',
						basePath: 'expedlog/',
						path: 'new-route/'
					},
					async handler(
						expedLogCtx: Context<INewRouteExpedLog>
					): Promise<IResponseExpedLog> {
						return await this.NewRoutePost(expedLogCtx);
					}
				}
			}
		});
	}

	public async NewRoutePost(expedLogCtx: Context<INewRouteExpedLog>) {
		const expedLogParams = expedLogCtx.params;
		const validation = validatorFactory<newRouteExpedLogSchemaType>(
			NewRouteExpedLogSchema
		);
		const bodyReceived = expedLogParams as newRouteExpedLogSchemaType;
		const validateJson = validation.verify(bodyReceived);

		if (validateJson) {
			const expedLogController = new ExpedLogRequests();
			const responseToken: ITokenExpedLog =
				await expedLogController.ExpedLogRequestsToken(expedLogParams);

			if (responseToken.token) {
				const expedLogRequest =
					await expedLogController.ExpedLogRequests(
						expedLogParams,
						responseToken.token,
						this.url
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
}
