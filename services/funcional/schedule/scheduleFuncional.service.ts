import { CronJob } from 'cron';
import {
	Errors,
	ServiceBroker,
	ServiceSchema,
	Service as MoleculerService
} from 'moleculer';

import { Event, Service } from 'moleculer-decorators';
import { INewStatus } from '../../../src/interface/funcional/order/statusFuncional.interface';
import { formatDate } from '../../library/dateTime/formatDateTime';
import { apmElasticConnect, loggerElastic } from '../../library/elasticSearch';

@Service({
	name: 'funcional.schedule.orders',
	group: 'flow-funcional'
})
export default class ScheduleFuncionalService extends MoleculerService {
	indexName = 'flow-funcional-orders';
	isCode = '200';
	originLayer = 'funcional';
	serviceNameCron = 'OrdersFuncionalService CronJob';
	serviceNameSchedule = 'OrdersFuncionalService Schedule';

	public constructor(public broker: ServiceBroker, schema: ServiceSchema) {
		super(broker);
		// this.cronJob = new CronJob(process.env.FUNCIONAL_CRON, async () => {
		// 	try {
		// 		this.broker.broadcast('ScheduleStart', '');
		// 	} catch {
		// 		new Error('Cron not run');
		// 	}
		// });

		// if (!this.cronJob.running) this.cronJob.start();
	}

	@Event({
		name: 'ScheduleStart',
		group: 'flow-funcional'
	})
	public async scheduleStart() {
		try {
			const JsonSend: INewStatus = {
				cronJob: true,
				methodSend: 'get',
				urlObj: {
					isDate: `Filter=dateTimeUpdate gt '${formatDate(
						new Date()
					)}'`
				}
			};

			this.broker.broadcast(
				'service.integration.schedule.orders',
				JsonSend
			);

			this.broker.broadcast(
				'funcional.integration.cron.orders',
				process.env.FUNCIONAL_ATIVE
			);
			const dateTime = new Date();
			const objSend = {
				message: 'Start Routine',
				date: dateTime
			};
			loggerElastic(
				this.indexName,
				this.isCode,
				this.originLayer,
				this.serviceName,
				process.env.FUNCIONAL_ATIVE,
				JSON.stringify(objSend)
			);
		} catch (error) {
			loggerElastic(
				this.indexName,
				'500',
				this.originLayer,
				this.serviceName,
				'Functional cron not started',
				JSON.stringify(error.message)
			);
			apmElasticConnect.captureError(
				new Error('Cron not run' + JSON.stringify(error))
			);
		}
	}

	@Event({
		name: 'funcional.schedule.funcional.orders',
		group: 'flow-funcional'
	})
	public async OrdersMethod(ctxMessage: any) {
		try {
			this.logger.info('CHEGOU FUNCIONAL ' + JSON.stringify(ctxMessage));

			loggerElastic(
				this.indexName,
				this.isCode,
				this.originLayer,
				this.serviceNameSchedule,
				JSON.stringify(ctxMessage),
				JSON.stringify('Sucess')
			);
		} catch (error) {
			loggerElastic(
				this.indexName,
				error.code,
				this.originLayer,
				this.serviceNameSchedule,
				JSON.stringify(ctxMessage),
				JSON.stringify(error.message)
			);
			apmElasticConnect.captureError(new Error(error.message));
			throw new Errors.MoleculerError(error.message, error.code);
		}
	}
}
