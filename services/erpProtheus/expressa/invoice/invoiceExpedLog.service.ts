'use strict';
import * as dotenv from 'dotenv';
import { Service as MoleculerService, ServiceBroker } from 'moleculer';
import { Event, Service } from 'moleculer-decorators';
import InvoiceExpedLogBusinessRule from '../../../../src/controller/expedlog/invoice/invoiceExpedLog.controller';
import { IFetchInvoiceExpedLogReturn } from '../../../../src/interface/expedLog/invoiceExpedLog.interface';
import {
	apmElasticConnect,
	loggerElastic
} from '../../../library/elasticSearch';
dotenv.config();

@Service({
	name: 'expedlog.erpprotheusexpressa.invoices',
	group: 'flow-expedlog'
})
export default class InvoicesProtheusExpedLogService extends MoleculerService {
	indexName = 'flow-protheusexpressa-invoices';
	isCode = '200';
	originLayer = 'erpprotheusexpressa';
	serviceName = 'InvoicesExpedLogService';

	public constructor(public broker: ServiceBroker) {
		super(broker);
	}

	@Event({
		name: 'expedlog-protheus.fetch-invoice.post',
		group: 'flow-expedlog'
	})
	public async FetchInvoiceExpedLogPost(
		expedLogMessage: IFetchInvoiceExpedLogReturn
	) {
		try {
			const expedLogController = new InvoiceExpedLogBusinessRule();
			const requestProtheus =
				await expedLogController.FetchInvoiceExpedLogPost(
					expedLogMessage
				);

			loggerElastic(
				this.indexName,
				this.isCode,
				this.originLayer,
				this.serviceNamePost,
				JSON.stringify(expedLogMessage),
				JSON.stringify(requestProtheus)
			);

			return requestProtheus;
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
