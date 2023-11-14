('use strict');

import { CronJob } from 'cron';
import { Service as MoleculerService, ServiceBroker } from 'moleculer';
import { Event, Service } from 'moleculer-decorators';
import { connectionIntegrador } from '../../../src/data-source';
import { InvoiceExpedLog } from '../../../src/entity/integration/invoiceExpedLog.entity';
import InvoiceExpedLogBusinessRule from '../../../src/controller/expedlog/invoice/invoiceExpedLog.controller';
import {
	IFetchInvoiceExpedLogReturn,
	IInvoiceIntegrationExpedLog,
	IInvoiceIntegrationExpedLogReturn
} from '../../../src/interface/expedLog/invoiceExpedLog.interface';
import { apmElasticConnect, loggerElastic } from '../../library/elasticSearch';

@Service({
	name: 'expedlog.invoice',
	group: 'flow-expedlog'
})
export default class InvoiceExpedLogService extends MoleculerService {
	indexName = 'flow-expedlog';
	isCode = '200';
	errCode = '499';
	originLayer = 'integration';
	serviceNamePost = 'InvoiceServicePost';
	serviceNameGet = 'InvoiceServiceGet';
	serviceNameSchedule = 'InvoiceServiceSchedule';
	responseReturn: any | IInvoiceIntegrationExpedLogReturn;
	requestReturn: any | IInvoiceIntegrationExpedLogReturn;

	public constructor(public broker: ServiceBroker) {
		super(broker);

		const CronJobExecute = new CronJob(
			process.env.EXPEDLOG_INVOICE_SYNC_CRON,
			async () => {
				try {
					this.broker.broadcast(
						'service.protheusExpedLog.invoice.syncInvoiceDataWithProtheus',
						process.env.EXPEDLOG_ATIVE
					);
				} catch {
					new Error('Cron not run');
				}
			}
		);

		if (!CronJobExecute.running) CronJobExecute.start();
	}

	@Event({
		name: 'expedlog.invoice-integration.post',
		group: 'flow-expedlog'
	})
	public async InvoiceIntegrationExpedLogPost(
		expedLogMessage: IInvoiceIntegrationExpedLog
	) {
		try {
			const expedLogController = new InvoiceExpedLogBusinessRule();
			this.responseReturn =
				await expedLogController.InvoiceIntegrationExpedLogPost(
					expedLogMessage
				);

			loggerElastic(
				this.indexName,
				this.isCode,
				this.originLayer,
				this.serviceNamePost,
				JSON.stringify(expedLogMessage),
				JSON.stringify(this.responseReturn)
			);

			return this.responseReturn;
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

	@Event({
		name: 'service.protheusExpedLog.invoice.syncInvoiceDataWithProtheus',
		group: 'flow-expedlog'
	})
	public async syncReceivedInvoice(enabled: string) {
		try {
			if (enabled === 'true') {
				console.log(
					'======== CRON JOB EXPEDLOG INTEGRA NOTAS FISCAIS ========='
				);
				const invoiceData = await connectionIntegrador
					.getRepository(InvoiceExpedLog)
					.findBy({
						integrated: false
					});

				if (!invoiceData.length) return;

				const expedLogController = new InvoiceExpedLogBusinessRule();
				invoiceData.forEach(async (invoice) => {
					const requestBody = JSON.parse(invoice.receivedBody);
					const invoiceSent =
						await expedLogController.FetchInvoiceExpedLogPost(
							requestBody as IFetchInvoiceExpedLogReturn
						);
					if (invoiceSent.code == 201 || invoiceSent.code == 401) {
						await connectionIntegrador
							.getRepository(InvoiceExpedLog)
							.update(invoice.id, {
								integrated: true,
								returnedBody: JSON.stringify(invoiceSent)
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
