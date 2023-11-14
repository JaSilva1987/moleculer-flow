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
	IResponseExpedLog
} from '../../../src/interface/expedLog/expedLog.interface';
import { ISLASearchTableExpedLog } from '../../../src/interface/expedLog/slaExpedLog.interface';
import {
	SLASearchTableExpedLogSchema,
	slaSearchTableExpedLogSchemaType
} from '../../../src/validator/expedLog/sla/slaExpedLog.validator';
import { validatorFactory } from '../../../src/validator/validator';
import { loggerElastic } from '../../library/elasticSearch';

export default class SLASearchTableExpedLog extends MoleculerService {
	indexName = 'flow-expedlog';
	isCode = '200';
	errCode = '499';
	originLayer = 'expedlog';
	serviceNamePost = 'SLASearchTableExpedLogServicePost';
	serviceNameGet = 'SLASearchTableExpedLogServiceGet';
	responseReturn: any | IResponseExpedLog;
	responseApi: any | IResponseExpedLog;

	public constructor(broker: ServiceBroker) {
		super(broker);

		this.parseServiceSchema({
			name: 'expedlog-sla-search-table',
			group: 'flow-expedlog',
			actions: {
				post: {
					cache: false,
					rest: {
						method: 'POST',
						basePath: 'expedlog/',
						path: 'search-sla-table/'
					},
					async handler(
						expedLogCtx: Context<ISLASearchTableExpedLog>
					): Promise<IResponseExpedLog> {
						return await this.SLASearchTablePost(expedLogCtx);
					}
				}
			}
		});
	}

	public async SLASearchTablePost(
		expedLogCtx: Context<ISLASearchTableExpedLog>
	) {
		const expedLogParams = expedLogCtx.params;
		const validation = validatorFactory<slaSearchTableExpedLogSchemaType>(
			SLASearchTableExpedLogSchema
		);
		const bodyReceived = expedLogParams as slaSearchTableExpedLogSchemaType;
		const validateJson = validation.verify(bodyReceived);

		if (validateJson) {
			this.responseApi = await this.broker.emit(
				'expedlog.sla-search-table.post',
				expedLogParams
			);

			this.responseApi.forEach((expedLogReturn: object) => {
				this.responseReturn = expedLogReturn;
			});
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
			return await Promise.resolve(validReturn.message);
		} else {
			return await Promise.reject(
				new Errors.MoleculerError(
					validReturn.message ||
						validReturn.detailedMessage ||
						String(validReturn),
					validReturn.status || +validReturn.code || 400
				)
			);
		}
	}
}
