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
	IFetchInvoiceExpedLogReturn,
	IInvoiceIntegrationExpedLog
} from '../../../interface/expedLog/invoiceExpedLog.interface';

export default class InvoiceExpedLogBusinessRule {
	indexName = 'flow-expedlog';
	isCode = '200';
	errCode = '499';
	originLayer = 'controller';
	serviceNamePost = 'InvoiceExpedLogServicePost';
	serviceNameGet = 'InvoiceExpedLogServiceGet';
	serviceNameSchedule = 'InvoiceExpedLogServiceSchedule';
	invoiceIntegrationUrl = process.env.EXPEDLOG_INVOICE_INTEGRATION_URL;
	fetchInvoiceUrl = process.env.PROTHEUS_EXPEDLOG_FETCH_INVOICE_URL;

	public async InvoiceIntegrationExpedLogPost(
		expedLogMessage: IInvoiceIntegrationExpedLog
	) {
		try {
			const expedLogController = new ExpedLogRequests();
			const responseToken: ITokenExpedLog =
				await expedLogController.ExpedLogRequestsToken(expedLogMessage);

			if (responseToken.token) {
				const sendRequest = await expedLogController.ExpedLogRequests(
					expedLogMessage,
					responseToken.token,
					this.invoiceIntegrationUrl
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

	public async FetchInvoiceExpedLogPost(
		expedLogMessage: IFetchInvoiceExpedLogReturn
	) {
		try {
			const expedLogController = new ExpedLogRequests();

			const sendRequest =
				await expedLogController.ProtheusExpedLogRequests(
					expedLogMessage,
					this.fetchInvoiceUrl
				);

			if (!sendRequest)
				return {
					code: StatusCodeExpedLog.error,
					message: TreatmentExpedLog.requestError,
					detailedMessage: TreatmentExpedLog.requestError
				};
			return sendRequest;
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
