'use strict';

import { CronJob } from 'cron';
import { Errors, Service as MoleculerService, ServiceBroker } from 'moleculer';
import { Event, Service } from 'moleculer-decorators';
import { apmElasticConnect, loggerElastic } from '../elasticSearch';

@Service({
	name: 'cronJobFlow',
	group: 'flow-cronJobs'
})
export default class CronJobFlow extends MoleculerService {
	public conexao: any;
	public runProcess = 'true';

	public cronJobOne: CronJob;

	public constructor(broker: ServiceBroker) {
		super(broker);

		this.cronJobOne = new CronJob(
			process.env.FLOW_CREMER_CRON_SERVICE,
			async () => {
				try {
					this.broker.broadcast(
						'CallEvents',
						process.env.FLOW_CREMER_ATIVE
					);
				} catch {
					new Error('Cron not run');
				}
			}
		);

		this.cronJobTwo = new CronJob(
			process.env.FLOW_CREMER_CRON_MANUTOF,
			async () => {
				try {
					this.broker.broadcast(
						'CallManut',
						process.env.FLOW_CREMER_ATIVE
					);
				} catch {
					new Error('Cron not run');
				}
			}
		);

		this.cronJobThree = new CronJob(
			process.env.FLOW_CREMER_CRON_GENERATE_VALIDATIONS,
			async () => {
				try {
					this.broker.broadcast(
						'CallGenerate',
						process.env.FLOW_CREMER_ATIVE
					);
				} catch {
					new Error('Cron not run');
				}
			}
		);

		this.cronJobFour = new CronJob(
			process.env.FLOW_CREMER_CRON_PAYMENT,
			async () => {
				try {
					this.broker.broadcast(
						'CallPayment',
						process.env.FLOW_CREMER_ATIVE
					);
				} catch {
					new Error('Cron not run');
				}
			}
		);

		this.cronJobFive = new CronJob(
			process.env.FLOW_CREMER_CRON_AGUARDANDO_PROCESSAMENTO,
			async () => {
				try {
					this.broker.broadcast(
						'CallAwaitProcess',
						process.env.FLOW_ORDERS_AGUARDANDO_PROCESSAMENTO
					);
				} catch {
					new Error('Cron not run');
				}
			}
		);

		if (!this.cronJobOne.running) this.cronJobOne.start();
		if (!this.cronJobTwo.running) this.cronJobTwo.start();
		if (!this.cronJobThree.running) this.cronJobThree.start();
		if (!this.cronJobFour.running) this.cronJobFour.start();
		if (!this.cronJobFive.running) this.cronJobFive.start();
	}

	@Event({
		name: 'CallEvents',
		group: 'cronJobs-flow'
	})
	public async CallEvents(ctx: any) {
		try {
			if (ctx.params === 'true') {
				//IsoCrm;
				await this.broker.broadcast(
					'service-crmiso-order-poolQueryCrmOrders',
					this.runProcess
				);
				//Integrador
				await this.broker.broadcast(
					'service-integration-order-statusChange',
					this.runProcess
				);
			}
		} catch (error) {
			loggerElastic(
				this.indexName,
				this.statusElastic,
				this.originLayer,
				this.serviceName,
				this.returnEmpty,
				JSON.stringify(error.message)
			);
			apmElasticConnect.captureError(new Error(error.message));
			throw new Errors.MoleculerError(error.message, error.code);
		}
	}

	@Event({
		name: 'CallGenerate',
		group: 'cronJobs-flow'
	})
	public async CallGenerate(ctx: any) {
		try {
			if (ctx.params === 'true') {
				await this.broker.broadcast(
					'service-integration-order-starGetConsumer',
					this.runProcess
				);
				await this.broker.broadcast(
					'service-integration-order-startGetUnity',
					this.runProcess
				);
				await this.broker.broadcast(
					'service-integration-sendGenerateOf',
					this.runProcess
				);
			}
		} catch (error) {
			loggerElastic(
				this.indexName,
				this.statusElastic,
				this.originLayer,
				this.serviceName,
				this.returnEmpty,
				JSON.stringify(error.message)
			);
			apmElasticConnect.captureError(new Error(error.message));
			throw new Errors.MoleculerError(error.message, error.code);
		}
	}

	@Event({
		name: 'CallManut',
		group: 'cronJobs-flow'
	})
	public async CallManutpublic(ctx: any) {
		try {
			if (ctx.params === 'true') {
				await this.broker.broadcast(
					'service-crmIso-PoolCheckChangedOf'
				);
			}
		} catch (error) {
			loggerElastic(
				this.indexName,
				this.statusElastic,
				this.originLayer,
				this.serviceName,
				this.returnEmpty,
				JSON.stringify(error.message)
			);
			apmElasticConnect.captureError(new Error(error.message));
			throw new Errors.MoleculerError(error.message, error.code);
		}
	}

	@Event({
		name: 'CallPayment',
		group: 'cronJobs-flow'
	})
	public async CallPayment(ctx: any) {
		try {
			if (ctx.params === 'true') {
				await this.broker.broadcast('flow-crmiso-payments');
			}
		} catch (error) {
			loggerElastic(
				this.indexName,
				this.statusElastic,
				this.originLayer,
				this.serviceName,
				this.returnEmpty,
				JSON.stringify(error.message)
			);
			apmElasticConnect.captureError(new Error(error.message));
			throw new Errors.MoleculerError(error.message, error.code);
		}
	}

	@Event({
		name: 'CallAwaitProcess',
		group: 'cronJobs-flow'
	})
	public async CallAwaitProcess(ctx: any) {
		try {
			if (ctx.params === 'true') {
				await this.broker.broadcast(
					'service-integration-getAwaitProcess'
				);

				await this.broker.broadcast(
					'service-integration-getRecordLocked'
				);
			}
		} catch (error) {
			loggerElastic(
				this.indexName,
				this.statusElastic,
				this.originLayer,
				this.serviceName,
				this.returnEmpty,
				JSON.stringify(error.message)
			);
			apmElasticConnect.captureError(new Error(error.message));
			throw new Errors.MoleculerError(error.message, error.code);
		}
	}
}
