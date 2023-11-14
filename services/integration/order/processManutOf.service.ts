import { CronJob } from 'cron';
import {
	Service as MoleculerService,
	ServiceBroker,
	ServiceSchema
} from 'moleculer';
import { Event, Service } from 'moleculer-decorators';
import { StatusManutOf } from '../../../src/enum/crmIso/enum';
import { IProcessManutOf } from '../../../src/interface/crmIso/orderFat/updateManutOf.interface';
import { IntegradorManutOfRepository } from '../../../src/repository/integration/order/manutOf.repository';
import { loggerElastic } from '../../library/elasticSearch';

@Service({
	name: 'ProcessManutOfServices',
	group: 'flow-cremmer'
})
export default class ProcessManutOfServices extends MoleculerService {
	public indexName = 'flow-crmiso-manutof';
	public serviceName = 'ProcessManutOfServices.service';
	public originLayer = 'integration';
	responseApi: any | object;
	returnBox: Array<object>;

	public constructor(public broker: ServiceBroker, schema: ServiceSchema) {
		super(broker);

		const CronJobExecute = new CronJob(
			process.env.FLOW_CREMER_CRON_PROCESS_MANUT,
			async () => {
				try {
					this.broker.broadcast(
						'service.integration.processManutOf',
						process.env.FLOW_CREMER_ATIVE
					);
				} catch {
					new Error('Cron not run');
				}
			}
		);

		if (!CronJobExecute.running) CronJobExecute.start();
	}

	@Event({
		name: 'service.integration.processManutOf',
		group: 'flow-cremmer'
	})
	public async updateOrderField(enabled: string) {
		try {
			if (enabled == 'true') {
				const resultProcess =
					await IntegradorManutOfRepository.GetManutOf(
						StatusManutOf.Processing
					);

				if (
					typeof resultProcess != 'undefined' &&
					resultProcess != null &&
					resultProcess.length > 0
				) {
					resultProcess.forEach(async (message: IProcessManutOf) => {
						await this.broker.emit(
							'service.crmIso.orderFat.updateManutOf',
							message
						);
					});

					loggerElastic(
						this.indexName,
						'200',
						this.originLayer,
						this.serviceName,
						'',
						JSON.stringify(resultProcess)
					);
				}
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
