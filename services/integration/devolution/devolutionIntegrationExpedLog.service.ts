('use strict');

import { CronJob } from 'cron';
import { Service as MoleculerService, ServiceBroker } from 'moleculer';
import { Service } from 'moleculer-decorators';
import { connectionIntegrador } from '../../../src/data-source';
import { loggerElastic } from '../../library/elasticSearch';
import DevolutionExpedLogBusinessRule from '../../../src/controller/expedlog/devolution/devolutionExpedLog.controller';
import { IDevolutionCollectionStatus } from '../../../src/interface/expedLog/devolutionCollectionStatus.interface';
import { DevolutionExpedLog } from '../../../src/entity/integration/devolutionExpedLog.entity';
import { INewDevolutionExpedLog } from '../../../src/interface/expedLog/newDevolution.interface';

@Service({
	name: 'expedlog.devolution',
	group: 'flow-expedlog'
})
export default class DevolutionIntegrationExpedLogService extends MoleculerService {
	indexName = 'flow-expedlog';
	isCode = '200';
	errCode = '499';
	originLayer = 'integration';
	serviceNamePost = 'DevolutionServicePost';
	serviceNameGet = 'DevolutionServiceGet';
	serviceNameSchedule = 'DevolutionExpedLogServiceSchedule';
	responseReturn: any | INewDevolutionExpedLog;
	requestReturn: any | INewDevolutionExpedLog;

	public constructor(public broker: ServiceBroker) {
		super(broker);

		const CronJobExecute = new CronJob(
			process.env.EXPEDLOG_DEVOLUTION_SYNC_CRON,
			async () => {
				try {
					this.syncDevolutionStatus(process.env.EXPEDLOG_ATIVE);
				} catch {
					new Error('Cron not run');
				}
			}
		);

		if (!CronJobExecute.running) CronJobExecute.start();
	}

	public async syncDevolutionStatus(enabled: string) {
		try {
			if (enabled === 'true') {
				console.log(
					'======== CRON JOB EXPEDLOG STATUS DE DEVOLUCAO ========='
				);
				const devolutionData: DevolutionExpedLog[] =
					await connectionIntegrador
						.getRepository(DevolutionExpedLog)
						.findBy({
							integrated: false
						});

				if (!devolutionData || !devolutionData.length) return;

				const expedLogController = new DevolutionExpedLogBusinessRule();
				devolutionData.forEach(async (devolution) => {
					const requestBody = JSON.parse(devolution.receivedBody);
					const devolutionSent =
						await expedLogController.SendDevolutionStatusExpedLog(
							requestBody as IDevolutionCollectionStatus
						);
					if (
						devolutionSent.code == 201 ||
						devolutionSent.code == 401
					) {
						await connectionIntegrador
							.getRepository(DevolutionExpedLog)
							.update(devolution.id, {
								integrated: true,
								returnedBody: JSON.stringify(devolutionSent)
							});
					}
				});
			}
		} catch (error) {
			loggerElastic(
				this.indexName,
				'499',
				this.originLayer,
				this.serviceName,
				JSON.stringify(enabled),
				JSON.stringify(error.message)
			);
		}
	}
}
