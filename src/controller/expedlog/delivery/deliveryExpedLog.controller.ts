import {
	apmElasticConnect,
	loggerElastic
} from '../../../../services/library/elasticSearch';
import ExpedLogRequests from '../requestsExpedLog.controller';
import {
	StatusCodeExpedLog,
	TreatmentExpedLog
} from '../../../enum/expedLog/enum';
import { IScheduleDeliveryExpedLog } from '../../../interface/expedLog/deliveryExpedLog.interface';
import { ITokenExpedLog } from '../../../interface/expedLog/expedLog.interface';

export default class DeliveryExpedLogBusinessRule {
	indexName = 'flow-expedlog';
	isCode = '200';
	errCode = '499';
	originLayer = 'controller';
	serviceNamePost = 'DeliveryExpedLogServicePost';
	serviceNameGet = 'DeliveryExpedLogServiceGet';
	serviceNameSchedule = 'DeliveryExpedLogServiceSchedule';
	url = process.env.EXPEDLOG_SCHEDULE_DELIVERY_URL;

	public async DeliveryExpedLogPost(
		expedLogMessage: IScheduleDeliveryExpedLog
	) {
		try {
			const expedLogController = new ExpedLogRequests();
			const responseToken: ITokenExpedLog =
				await expedLogController.ExpedLogRequestsToken(expedLogMessage);

			if (responseToken.token) {
				const sendRequest = await expedLogController.ExpedLogRequests(
					expedLogMessage,
					responseToken.token,
					this.url
				);

				return sendRequest;
			} else {
				return {
					code: StatusCodeExpedLog.noToken,
					message: TreatmentExpedLog.noToken,
					detailedMessage: TreatmentExpedLog.detailToken
				};
			}
		} catch (error) {
			loggerElastic(
				this.indexName,
				this.errCode,
				this.originLayer,
				this.serviceNamePost,
				JSON.stringify(expedLogMessage),
				JSON.stringify(error.message)
			);
			apmElasticConnect.captureError(new Error(error.message));
		}
	}
}
