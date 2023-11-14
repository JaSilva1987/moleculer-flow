import { CronJob } from 'cron';
import * as dotenv from 'dotenv';
import {
	Service as MoleculerService,
	ServiceBroker,
	ServiceSchema
} from 'moleculer';
import { Event, Service } from 'moleculer-decorators';
import { statusEcommerceIntegration } from '../../../src/enum/integration/statusEcommerceProducts.enum';
import {
	IInvoiceOrder,
	ISendInvoiceOrder
} from '../../../src/interface/climba/invoice/invoice.interface';
import { IInvoiceErpProtheus } from '../../../src/interface/erpProtheus/invoice/invoice.interface';
import { IDataInvoiceOrder } from '../../../src/interface/integration/invoice/invoice.interface';
import { EcommerceInvoiceIntegrationRepository } from '../../../src/repository/integration/invoice/invoice.repository';
import { apmElasticConnect, loggerElastic } from '../../library/elasticSearch';

dotenv.config();

@Service({
	name: 'service.integrationecommerce.invoice',
	group: 'flow-climba'
})
export default class InvoiceOrderEcommerceService extends MoleculerService {
	public constructor(public broker: ServiceBroker, schema: ServiceSchema) {
		super(broker);

		this.cronJobOne = new CronJob(
			process.env.CRON_SENDINVOICE_TOCLIMBA,
			async () => {
				try {
					this.broker.broadcast(
						'ecommerce.integration.invoiceWithError',
						process.env.PROTHEUS_INVOICE_ATIVE
					);
				} catch {
					new Error('Cron not run');
				}
			}
		);

		if (!this.cronJobOne.running) this.cronJobOne.start();
	}

	public indexName = 'flow-ecommerce-invoice';
	public serviceName = 'integration.invoice.service';
	public originLayer = 'integration';

	@Event({
		name: 'ecommerce.integration.invoice',
		group: 'flow-climba'
	})
	public async invoiceOrderEcommerce(message: IInvoiceErpProtheus) {
		try {
			this.logger.info('==============INTEGRATION INVOICE==============');
			let response;
			const repository = EcommerceInvoiceIntegrationRepository;

			const messageJSON: IInvoiceOrder = {
				number: message.invoice,
				nfeAccessKey: message.key,
				logisticOperatorId: message.series,
				xml: message.XML,
				volumes: message.volume
			};

			const invoiceIntegration: IDataInvoiceOrder = {
				idOrder: message.orderCRM,
				numberInvoice: message.invoice,
				JSON: JSON.stringify(messageJSON),
				status: statusEcommerceIntegration.toIntegration,
				createdAt: new Date(),
				updatedAt: new Date()
			};

			const existInvoiceOrder =
				await repository.GetEcommerceInvoiceIntegration(
					invoiceIntegration.idOrder,
					invoiceIntegration.numberInvoice
				);

			let status: string;

			if (existInvoiceOrder.length > 0) {
				if (
					existInvoiceOrder[0].status !=
					statusEcommerceIntegration.success
				) {
					response = await repository.PutEcommerceInvoiceIntegration(
						invoiceIntegration,
						existInvoiceOrder[0].id
					);
				}
				status = existInvoiceOrder[0].status;
			} else {
				response = await repository.PostEcommerceInvoiceIntegration(
					invoiceIntegration
				);

				status = statusEcommerceIntegration.toIntegration;
			}

			const sendInvoice: ISendInvoiceOrder = {
				jsonInvoice: messageJSON,
				dataInvoice: invoiceIntegration
			};

			if (status != statusEcommerceIntegration.success) {
				await this.broker.broadcast(
					'service.climba.invoice.PostInvoice',
					sendInvoice
				);
			}

			loggerElastic(
				this.indexName,
				'200',
				this.originLayer,
				this.serviceName,
				JSON.stringify(message),
				JSON.stringify(response)
			);
		} catch (error) {
			loggerElastic(
				this.indexName,
				'499',
				this.originLayer,
				this.serviceName,
				JSON.stringify(message),
				JSON.stringify(error.message)
			);
			apmElasticConnect
				.setTransactionName(this.indexName)
				.captureError(new Error(error.message))
				.endTransaction();
		}
	}

	@Event({
		name: 'ecommerce.integration.invoiceWithError',
		group: 'flow-climba'
	})
	public async invoiceOrderEcommerceWithError(enabled: string) {
		this.serviceName = 'integration.invoiceError.service';
		if (enabled === 'true') {
			try {
				this.logger.info(
					'==============BUSCA INVOICE COM ERRORs=============='
				);

				const repository = EcommerceInvoiceIntegrationRepository;

				const getInvoiceError =
					await repository.GetEcommerceInvoiceIntegrationError();

				if (getInvoiceError.length > 0) {
					for (const invoice of getInvoiceError) {
						const jsonInvoice: IInvoiceOrder = JSON.parse(
							invoice.JSON
						);

						const invoiceIntegration: IDataInvoiceOrder = {
							idOrder: invoice.idOrder,
							numberInvoice: invoice.numberInvoice,
							JSON: JSON.stringify(jsonInvoice),
							status: statusEcommerceIntegration.toIntegration,
							createdAt: new Date(),
							updatedAt: new Date()
						};

						const sendInvoice: ISendInvoiceOrder = {
							jsonInvoice: jsonInvoice,
							dataInvoice: invoiceIntegration
						};

						await this.broker.broadcast(
							'service.climba.invoice.PostInvoice',
							sendInvoice
						);
					}
				}
			} catch (error) {
				loggerElastic(
					this.indexName,
					'499',
					this.originLayer,
					this.serviceName,
					JSON.stringify('Busca invoice com erros para reenvio'),
					JSON.stringify(error.message)
				);
				apmElasticConnect
					.setTransactionName(this.indexName)
					.captureError(new Error(error.message))
					.endTransaction();
			}
		}
	}
}
