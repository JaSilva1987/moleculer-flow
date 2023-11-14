'use strict';
import { CronJob } from 'cron';
import { differenceInMinutes, format, sub } from 'date-fns';
import * as dotenv from 'dotenv';
import { Service as MoleculerService, ServiceBroker } from 'moleculer';
import { Event, Service } from 'moleculer-decorators';
import { IGetToken } from '../../../../src/interface/erpProtheus/global';
import { IInvoiceErpProtheus } from '../../../../src/interface/erpProtheus/invoice/invoice.interface';
import { AxiosRequestType } from '../../../library/axios';
import {
	apmElasticConnect,
	loggerElastic
} from '../../../library/elasticSearch';
import { getTokenUrlGlobal } from '../../../library/erpProtheus';
import LogsRetrySystemController from '../../../../src/controller/integration/logs/logRetrySystem.controller';
import { ILogsRetryIntegration } from '../../../../src/interface/integration/logs/logRetryIntegration.interface';
dotenv.config();

@Service({
	name: 'ccare.erpprotheusviveo.invoicesecommerce',
	group: 'flow-climba'
})
export default class InvoicesEcommerceService extends MoleculerService {
	public indexName = 'flow-ecommerce-invoice';
	public originLayer = 'erpprotheusviveo';
	public serviceName = 'erpProtheusViveo.invoice.service';

	public constructor(public broker: ServiceBroker) {
		super(broker);

		this.cronJobOne = new CronJob(
			process.env.CRON_GET_INVOICE,
			async () => {
				try {
					this.broker.broadcast(
						'service.erpProtheusViveo.productecommerce.getInvoice',
						process.env.PROTHEUS_INVOICE_ATIVE
					);
				} catch {
					new Error('Cron not run');
				}
			}
		);

		if (!this.cronJobOne.running) this.cronJobOne.start();

		this.cronJobOneRetry = new CronJob(
			process.env.CRON_RETRY_INVOICE,
			async () => {
				try {
					this.broker.broadcast(
						'service.erpProtheusViveo.productecommerce.getInvoiceEcommerceRetry',
						process.env.PROTHEUS_INVOICE_ATIVE
					);
				} catch {
					new Error('Cron not run');
				}
			}
		);

		if (!this.cronJobOneRetry.running) this.cronJobOneRetry.start();
	}

	@Event({
		name: 'service.erpProtheusViveo.productecommerce.getInvoice',
		group: 'flow-climba'
	})
	public async getInvoiceEcommerce(enabled: string) {
		if (enabled === 'true') {
			try {
				this.logger.info(
					'==============BUSCA INVOICE ECOMMERCE PROTHEUS=============='
				);

				const nowDate = new Date();
				const endDate = format(nowDate, 'yyyyMMdd');
				const endHour = format(nowDate, 'HH:mm:ss');
				const startDate = format(
					sub(nowDate, { minutes: 5 }),
					'yyyyMMdd'
				);
				const startHour = format(
					sub(nowDate, { minutes: 5 }),
					'HH:mm:ss'
				);

				const token: IGetToken = await getTokenUrlGlobal(
					process.env.PROTHEUSVIVEO_BASEURL_BELLACOTTON +
						'11' +
						process.env.PROTHEUSVIVEO_URLTOKEN +
						process.env.PROTHEUSVIVEO_USER +
						process.env.PROTHEUSVIVEO_PASS
				);

				if (token.access_token) {
					const urlProtheusInvoice =
						process.env.PROTHEUSVIVEO_BASEURL_BELLACOTTON +
						process.env.PROTHEUSVIVEO_RESTCREMER +
						`/CustomerCareIntegration/api/v2/DANFEBase64/`;

					const getInvoice = await AxiosRequestType(
						urlProtheusInvoice,
						'',
						'get',
						{
							TenantId: '11,001043',
							Authorization: `Bearer ${token.access_token}`,
							IMPXML: 'S'
						},
						{
							PageSize: 100,
							Filter: `dateAuthorization ge '${startDate}' and dateAuthorization le '${endDate}' and hourAuthorization ge '${startHour}' and hourAuthorization le '${endHour}' and contains(origin , 'ECOMMERCE')`
						}
					);

					if (getInvoice.status == 200) {
						if (getInvoice.message.total == 1) {
							const invoiceSend: IInvoiceErpProtheus = {
								branchID: getInvoice.message.DANFE.branchID,
								orderERP: getInvoice.message.DANFE.orderERP,
								orderCRM: getInvoice.message.DANFE.orderCRM,
								invoice: parseInt(
									getInvoice.message.DANFE.invoice
								).toString(),
								series: getInvoice.message.DANFE.series,
								customer: getInvoice.message.DANFE.customer,
								store: getInvoice.message.DANFE.store,
								dateIssue: getInvoice.message.DANFE.dateIssue,
								hourIssue: getInvoice.message.DANFE.hourIssue,
								dateAuthorization:
									getInvoice.message.DANFE.dateAuthorization,
								hourAuthorization:
									getInvoice.message.DANFE.hourAuthorization,
								key: getInvoice.message.DANFE.key,
								volume: getInvoice.message.DANFE.volume,
								DANFE: getInvoice.message.DANFE.DANFE,
								XML: getInvoice.message.DANFE.XML
							};

							await this.broker.broadcast(
								'ecommerce.integration.invoice',
								invoiceSend
							);

							await this.broker.broadcast(
								'totalexpress.integration.invoice',
								invoiceSend
							);
						} else if (getInvoice.message.total > 1) {
							for (const invoice of getInvoice.message.DANFE) {
								const invoiceSend: IInvoiceErpProtheus = {
									branchID: invoice.branchID,
									orderERP: invoice.orderERP,
									orderCRM: invoice.orderCRM,
									invoice: parseInt(
										invoice.invoice
									).toString(),
									series: invoice.series,
									customer: invoice.customer,
									store: invoice.store,
									dateIssue: invoice.dateIssue,
									hourIssue: invoice.hourIssue,
									dateAuthorization:
										invoice.dateAuthorization,
									hourAuthorization:
										invoice.hourAuthorization,
									key: invoice.key,
									volume: invoice.volume,
									DANFE: invoice.DANFE,
									XML: invoice.XML
								};

								await this.broker.broadcast(
									'ecommerce.integration.invoice',
									invoiceSend
								);

								await this.broker.broadcast(
									'totalexpress.integration.invoice',
									invoiceSend
								);
							}
						}
					}
				}
			} catch (error) {
				loggerElastic(
					this.indexName,
					'499',
					this.originLayer,
					this.serviceName,
					JSON.stringify(error.message)
				);

				apmElasticConnect
					.setTransactionName(this.indexName)
					.captureError(new Error(error.message))
					.endTransaction();
			}
		}
	}

	@Event({
		name: 'service.erpProtheusViveo.productecommerce.getInvoiceEcommerceRetry',
		group: 'flow-climba'
	})
	public async getInvoiceEcommerceRetry(enabled: string) {
		if (enabled === 'true') {
			try {
				this.logger.info(
					'==============BUSCA INVOICE ECOMMERCE PROTHEUS=============='
				);

				const logsController = new LogsRetrySystemController();

				const message: ILogsRetryIntegration = {
					lenght: 0,
					executeDate: new Date(),
					systemName: 'ecommerce-getInvoice'
				};

				const getLastExecutation =
					await logsController.getLogsRetrySystem(message.systemName);

				if (getLastExecutation.length > 0) {
					const lastExecutation = getLastExecutation[0].executeDate;
					const difDate = differenceInMinutes(
						new Date(),
						lastExecutation
					);

					if (difDate > 60) {
						const token: IGetToken = await getTokenUrlGlobal(
							process.env.PROTHEUSVIVEO_BASEURL_BELLACOTTON +
								'11' +
								process.env.PROTHEUSVIVEO_URLTOKEN +
								process.env.PROTHEUSVIVEO_USER +
								process.env.PROTHEUSVIVEO_PASS
						);

						if (token.access_token) {
							const urlProtheusInvoice =
								process.env.PROTHEUSVIVEO_BASEURL_BELLACOTTON +
								process.env.PROTHEUSVIVEO_RESTCREMER +
								`/CustomerCareIntegration/api/v2/DANFEBase64/`;

							const getInvoice = await AxiosRequestType(
								urlProtheusInvoice,
								'',
								'get',
								{
									TenantId: '11,001043',
									Authorization: `Bearer ${token.access_token}`,
									IMPXML: 'S'
								},
								{
									PageSize: 300,
									Filter: `dateAuthorization ge '${format(
										lastExecutation,
										'yyyyMMdd'
									)}' and dateAuthorization le '${format(
										new Date(),
										'yyyyMMdd'
									)}' and hourAuthorization ge '${format(
										lastExecutation,
										'HH:mm:ss'
									)}' and hourAuthorization le '${format(
										new Date(),
										'HH:mm:ss'
									)}' and contains(origin , 'ECOMMERCE')`
								}
							);

							message.lenght = getInvoice?.message?.total || 0;
							await logsController.postLogsRetrySystem(message);

							if (getInvoice.status == 200) {
								if (getInvoice.message.total == 1) {
									const invoiceSend: IInvoiceErpProtheus = {
										branchID:
											getInvoice.message.DANFE.branchID,
										orderERP:
											getInvoice.message.DANFE.orderERP,
										orderCRM:
											getInvoice.message.DANFE.orderCRM,
										invoice: parseInt(
											getInvoice.message.DANFE.invoice
										).toString(),
										series: getInvoice.message.DANFE.series,
										customer:
											getInvoice.message.DANFE.customer,
										store: getInvoice.message.DANFE.store,
										dateIssue:
											getInvoice.message.DANFE.dateIssue,
										hourIssue:
											getInvoice.message.DANFE.hourIssue,
										dateAuthorization:
											getInvoice.message.DANFE
												.dateAuthorization,
										hourAuthorization:
											getInvoice.message.DANFE
												.hourAuthorization,
										key: getInvoice.message.DANFE.key,
										volume: getInvoice.message.DANFE.volume,
										DANFE: getInvoice.message.DANFE.DANFE,
										XML: getInvoice.message.DANFE.XML
									};

									await this.broker.broadcast(
										'ecommerce.integration.invoice',
										invoiceSend
									);

									await this.broker.broadcast(
										'totalexpress.integration.invoice',
										invoiceSend
									);
								} else if (getInvoice.message.total > 1) {
									for (const invoice of getInvoice.message
										.DANFE) {
										const invoiceSend: IInvoiceErpProtheus =
											{
												branchID: invoice.branchID,
												orderERP: invoice.orderERP,
												orderCRM: invoice.orderCRM,
												invoice: parseInt(
													invoice.invoice
												).toString(),
												series: invoice.series,
												customer: invoice.customer,
												store: invoice.store,
												dateIssue: invoice.dateIssue,
												hourIssue: invoice.hourIssue,
												dateAuthorization:
													invoice.dateAuthorization,
												hourAuthorization:
													invoice.hourAuthorization,
												key: invoice.key,
												volume: invoice.volume,
												DANFE: invoice.DANFE,
												XML: invoice.XML
											};

										await this.broker.broadcast(
											'ecommerce.integration.invoice',
											invoiceSend
										);

										await this.broker.broadcast(
											'totalexpress.integration.invoice',
											invoiceSend
										);
									}
								}
							}
						}
					}
				} else {
					await logsController.postLogsRetrySystem(message);
				}
			} catch (error) {
				loggerElastic(
					this.indexName,
					'499',
					this.originLayer,
					this.serviceName,
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
