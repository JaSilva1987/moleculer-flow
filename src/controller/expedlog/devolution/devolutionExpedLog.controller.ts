import {
	loggerElastic
} from '../../../../services/library/elasticSearch';
import ExpedLogRequests from '../requestsExpedLog.controller';
import {
	StatusCodeExpedLog,
	TreatmentExpedLog
} from '../../../enum/expedLog/enum';
import { IDevolutionCollectionStatus } from '../../../interface/expedLog/devolutionCollectionStatus.interface';

export default class DevolutionExpedLogBusinessRule {
	indexName = 'flow-expedlog';
	isCode = '200';
	errCode = '499';
	originLayer = 'controller';
	serviceNamePost = 'DevolutionExpedLogServicePost';
	serviceNameGet = 'DevolutionExpedLogServiceGet';
	serviceNameSchedule = 'DevolutionExpedLogServiceSchedule';
	url = process.env.PROTHEUS_EXPEDLOG_DEVOLUTION_COLLECTION_STATUS_URL;

	public async SendDevolutionStatusExpedLog(
		expedLogMessage: IDevolutionCollectionStatus
	) {
		try {
			const expedLogController = new ExpedLogRequests();

			const sendRequest =
				await expedLogController.ProtheusExpedLogRequests(
					expedLogMessage,
					this.url
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
		}
	}
}
