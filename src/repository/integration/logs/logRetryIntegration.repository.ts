import { Errors } from 'moleculer';
import { connectionIntegrador } from '../../../data-source';
import { LogsRetryIntegrationEntity } from '../../../entity/integration/logRetryIntegrationEntity';
import { ILogsRetryIntegration } from '../../../interface/integration/logs/logRetryIntegration.interface';

export const LogsRetryIntegrationRepository = connectionIntegrador
	.getRepository(LogsRetryIntegrationEntity)
	.extend({
		async GetLogRetryIntegration(
			systemName: string
		): Promise<ILogsRetryIntegration[]> {
			try {
				const result = await this.find({
					where: { systemName },
					order: { id: 'DESC' },
					take: 1
				});

				return result;
			} catch (error) {
				throw new Errors.MoleculerError(error.message, 100);
			}
		},

		async PostLogRetryIntegration(message: ILogsRetryIntegration) {
			try {
				const postMessage = await this.createQueryBuilder()
					.insert()
					.into(LogsRetryIntegrationEntity)
					.values(message)
					.execute();

				return postMessage;
			} catch (error) {
				throw new Errors.MoleculerRetryableError(
					error.message,
					error.code
				);
			}
		}
	});
