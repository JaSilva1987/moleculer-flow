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
import { IScheduleDeliveryExpedLog } from '../../../src/interface/expedLog/deliveryExpedLog.interface';
import {
	IExpedLogReturn,
	IResponseExpedLog
} from '../../../src/interface/expedLog/expedLog.interface';
import {
	ScheduleDeliveryExpedLogSchema,
	scheduleDeliveryExpedLogSchemaType
} from '../../../src/validator/expedLog/delivery/deliveryExpedLog.validator';
import { validatorFactory } from '../../../src/validator/validator';
import { loggerElastic } from '../../library/elasticSearch';

export default class DeliveryExpedLog extends MoleculerService {
	indexName = 'flow-expedlog';
	isCode = '200';
	errCode = '499';
	originLayer = 'expedlog';
	serviceNamePost = 'DeliveryExpedLogServicePost';
	serviceNameGet = 'DeliveryExpedLogServiceGet';
	responseReturn: any | IResponseExpedLog;
	responseApi: any | IResponseExpedLog;

	public constructor(broker: ServiceBroker) {
		super(broker);

		this.parseServiceSchema({
			name: 'expedlog-delivery',
			group: 'flow-expedlog',
			actions: {
				post: {
					cache: false,
					rest: {
						method: 'POST',
						basePath: 'expedlog/',
						path: 'schedule-delivery-forecast/'
					},
					async handler(
						expedLogCtx: Context<IScheduleDeliveryExpedLog>
					): Promise<IResponseExpedLog> {
						return await this.ScheduleDeliveryPost(expedLogCtx);
					}
				}
			}
		});
	}

	public async ScheduleDeliveryPost(
		expedLogCtx: Context<IScheduleDeliveryExpedLog>
	) {
		const expedLogParams = expedLogCtx.params;
		const validation = validatorFactory<scheduleDeliveryExpedLogSchemaType>(
			ScheduleDeliveryExpedLogSchema
		);
		const bodyReceived =
			expedLogParams as scheduleDeliveryExpedLogSchemaType;
		const validateJson = validation.verify(bodyReceived);

		if (validateJson) {
			this.responseApi = await this.broker.emit(
				'expedlog.delivery-schedule.post',
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
