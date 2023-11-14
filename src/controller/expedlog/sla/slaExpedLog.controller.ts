import {
	apmElasticConnect,
	loggerElastic
} from '../../../../services/library/elasticSearch';
import ExpedLogRequests from '../requestsExpedLog.controller';
import {
	StatusCodeExpedLog,
	TreatmentExpedLog
} from '../../../enum/expedLog/enum';
import { ITokenExpedLog } from '../../../interface/expedLog/expedLog.interface';
import {
	ISLARecalculationExpedLog,
	ISLASearchTableExpedLog
} from '../../../interface/expedLog/slaExpedLog.interface';

export default class SLAExpedLogBusinessRule {
	indexName = 'flow-expedlog';
	isCode = '200';
	errCode = '499';
	originLayer = 'controller';
	serviceNamePost = 'InvoiceIntegrationServicePost';
	serviceNameGet = 'InvoiceIntegrationServiceGet';
	serviceNameSchedule = 'InvoiceIntegrationServiceSchedule';
	urlRecalculation = process.env.EXPEDLOG_SLA_RECALCULATION_URL;
	urlSearchTable = process.env.EXPEDLOG_SLA_SEARCH_TABLE_URL;

	public async SLARecalculationExpedLogPost(
		expedLogMessage: ISLARecalculationExpedLog
	) {
		try {
			const expedLogController = new ExpedLogRequests();
			const responseToken: ITokenExpedLog =
				await expedLogController.ExpedLogRequestsToken(expedLogMessage);

			if (responseToken.token) {
				const sendRequest = await expedLogController.ExpedLogRequests(
					expedLogMessage,
					responseToken.token,
					this.urlRecalculation
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

	public async SLASearchTableExpedLogPost(
		expedLogMessage: ISLASearchTableExpedLog
	) {
		try {
			const expedLogController = new ExpedLogRequests();
			const responseToken: ITokenExpedLog =
				await expedLogController.ExpedLogRequestsToken(expedLogMessage);

			if (responseToken.token) {
				const sendRequest = await expedLogController.ExpedLogRequests(
					expedLogMessage,
					responseToken.token,
					this.urlSearchTable
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
