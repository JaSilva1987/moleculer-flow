import { loggerElastic } from '../../../../services/library/elasticSearch';
import { ILogsRetryIntegration } from '../../../interface/integration/logs/logRetryIntegration.interface';
import { LogsRetryIntegrationRepository } from '../../../repository/integration/logs/logRetryIntegration.repository';

export default class LogsRetrySystemController {
	public indexName = 'flow-integration-logsretry';
	public serviceName = 'integration.logsRetry.service';
	public originLayer = 'integration';
	public repository = LogsRetryIntegrationRepository;

	public async getLogsRetrySystem(systemName: string) {
		try {
			const getLogs = await this.repository.GetLogRetryIntegration(
				systemName
			);

			return getLogs;
		} catch (error) {
			loggerElastic(
				this.indexName,
				'499',
				this.originLayer,
				'logsretry.integration.getLogsRetrySystem',
				JSON.stringify('Busca ordem com erros'),
				JSON.stringify(error.message)
			);
		}
	}

	public async postLogsRetrySystem(message: ILogsRetryIntegration) {
		try {
			await this.repository.PostLogRetryIntegration(message);
		} catch (error) {
			loggerElastic(
				this.indexName,
				'499',
				this.originLayer,
				'logsretry.integration.postLogsRetrySystem',
				JSON.stringify('Erro ao inserir registros'),
				JSON.stringify(error.message)
			);
		}
	}
}
