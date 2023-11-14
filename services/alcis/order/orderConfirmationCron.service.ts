('use strict');

import { CronJob } from 'cron';
import { Service as MoleculerService, ServiceBroker } from 'moleculer';
import { Event, Service } from 'moleculer-decorators';
import { loggerElastic } from '../../library/elasticSearch';
import { setTransaction } from '../../../src/controller/alcis/services/alcisConfirmation.controller';

@Service({
	name: 'alcis-order-confirmation-cron',
	group: 'flow-alcis'
})
export default class OrderConfirmationCronService extends MoleculerService {
	indexName = 'flow-alcis';
	isCode = '200';
	errCode = '499';
	originLayer = 'integration';

	public constructor(public broker: ServiceBroker) {
		super(broker);

		const CronJobExecute =  new CronJob(
			process.env.ALCIS_PROTHEUS_CONFIRMATION,
			async () => {
				try {
					this.broker.broadcast('ProcessProtheusConfirmation', 'true');
				} catch {
					new Error('Cron not run');
				}
			}
		);

        if (!CronJobExecute.running) {
			CronJobExecute.start();
        }
	}

	
    @Event({
		name: 'ProcessProtheusConfirmation',
		group: 'cronJobs-flow'
	})
	public async CallGenerate(ctx: any) {
		try {
			loggerElastic(
				this.indexName,
				'200',
				this.originLayer,
				'IA Version 1 => CronJob => Protheus - PUT Order Confirmation',
				JSON.stringify('CronJob Iniciado'),
				JSON.stringify(ctx)
			);

			await setTransaction(
				Boolean(process.env.ALCIS_PROTHEUS_CONFIRMATION_ACTIVE)
			);
		} catch (error) {
			loggerElastic(
				this.indexName,
				'499',
				this.originLayer,
				'IA Version 1 => CronJob => Protheus - PUT Order Confirmation',
				JSON.stringify('CronJob Erro'),
				JSON.stringify(error)
			);
		}
	}
}
