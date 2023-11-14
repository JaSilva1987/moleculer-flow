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
import { ISLARecalculationExpedLog } from '../../../src/interface/expedLog/slaExpedLog.interface';
import {
	SLARecalculationExpedLogSchema,
	slaRecalculationExpedLogSchemaType
} from '../../../src/validator/expedLog/sla/slaExpedLog.validator';
import { validatorFactory } from '../../../src/validator/validator';
import { loggerElastic } from '../../library/elasticSearch';

export default class SLARecalculationExpedLog extends MoleculerService {
	indexName = 'flow-expedlog';
	isCode = '200';
	errCode = '499';
	originLayer = 'expedlog';
	serviceNamePost = 'SLARecalculationExpedLogServicePost';
	serviceNameGet = 'SLARecalculationExpedLogServiceGet';
	responseReturn: any | IResponseExpedLog;
	responseApi: any | IResponseExpedLog;

	public constructor(broker: ServiceBroker) {
		super(broker);

		this.parseServiceSchema({
			name: 'expedlog-sla-recalculation',
			group: 'flow-expedlog',
			actions: {
				post: {
					cache: false,
					rest: {
						method: 'POST',
						basePath: 'expedlog/',
						path: 'sla-recalculation/'
					},
					async handler(
						expedLogCtx: Context<ISLARecalculationExpedLog>
					): Promise<IResponseExpedLog> {
						return await this.SlaRecalculationPost(expedLogCtx);
					}
				}
			}
		});
	}

	public async SlaRecalculationPost(
		expedLogCtx: Context<ISLARecalculationExpedLog>
	) {
		const expedLogParams = expedLogCtx.params;
		const validation = validatorFactory<slaRecalculationExpedLogSchemaType>(
			SLARecalculationExpedLogSchema
		);
		const bodyReceived =
			expedLogParams as slaRecalculationExpedLogSchemaType;
		const validateJson = validation.verify(bodyReceived);

		if (validateJson) {
			this.responseApi = await this.broker.emit(
				'expedlog.sla-recalculation.post',
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
			return await Promise.resolve(validReturn);
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
