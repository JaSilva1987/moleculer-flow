'use strict';

import * as dotenv from 'dotenv';
import {
	Errors,
	Service as MoleculerService,
	ServiceBroker,
	ServiceSchema
} from 'moleculer';
import { Action, Service, Event } from 'moleculer-decorators';
import { alcisRequestController } from '../../../src/controller/alcis/services/alcisRequest.controller';
import {
	IIReceiptReceivedConfirmation,
	IReceiptReceivedConfirmation
} from '../../../src/interface/alcis/receipt/receiptConfirmation/receiptConfirmation.interface';
import { IReceiveReceipt } from '../../../src/interface/alcis/receipt/receiveReceipt/receiveReceipt.interface';
import { apmElasticConnect, loggerElastic } from '../../library/elasticSearch';
import { ReceiveReceiptRepository } from '../../../src/repository/integration/receipt/receiveReceipt.repository';
import { CronJob } from 'cron';
import { setTransaction } from '../../../src/controller/alcis/services/alcisReceiveReceipt.controller';
import { setTimeout } from 'timers/promises';
import { alcisRequestProtheusController } from '../../../src/controller/alcis/services/alcisRequestProtheus.controller';

dotenv.config();
@Service({
	name: 'alcis-receipt-confirmation',
	group: 'flow-alcis'
})
export default class receiptReceivedConfirmationData extends MoleculerService {
	public cronJobOne: CronJob;
	public indexName = 'flow-alcis-receipt-confirmation';
	public serviceName = 'receipt-cancellation.service';
	public originLayer = 'alcis';

	private async iniciarCronJob() {
		if (!this.cronJobOne.running) {
			this.cronJobOne.start();

			await setTimeout(5000);
			if (this.cronJobOne.running) {
				this.cronJobOne.stop();
			}
		}
	}

	public constructor(public broker: ServiceBroker, schema: ServiceSchema) {
		super(broker);

		this.cronJobOne = new CronJob(
			process.env.ALCIS_PROTHEUS_RECEIPT_RECEIVED,
			async () => {
				try {
					this.broker.broadcast(
						'ProcessProtheusReceiveReceipt',
						'true'
					);
				} catch {
					new Error('Cron not run');
				}
			}
		);

		this.iniciarCronJob();
	}

	private receiptReceivedConfirmationUrl =
		process.env.ALCIS_BASE_URL +
		process.env.ALCIS_RECEIPT_RECEIVED_CONFIRMATION_URL;

	public async started() {}
	@Action({
		cache: false,
		rest: 'GET receipt-received-confirmation/',
		name: 'service.alcis.get-receipt-received-confirmation',
		group: 'flow-alcis'
	})
	public async getReceiptReceivedConfirmation(context: any) {
		apmElasticConnect.startTransaction(
			'IA Version 1 => ALCIS - GET Receipt Received Confirmation',
			'request'
		);
		let getReceiptReceivedConfirmationParams = context.params;

		loggerElastic(
			this.indexName,
			'200',
			this.originLayer,
			this.serviceName,
			JSON.stringify(`get - ${this.receiptReceivedConfirmationUrl}`),
			JSON.stringify(getReceiptReceivedConfirmationParams)
		);

		try {
			const getReceiptReceivedConfirmationResponse =
				await alcisRequestController(
					this.receiptReceivedConfirmationUrl,
					null,
					'Authorization',
					'get',
					null,
					null,
					null,
					null,
					getReceiptReceivedConfirmationParams
				);

			if (getReceiptReceivedConfirmationResponse instanceof Error) {
				throw getReceiptReceivedConfirmationResponse;
			}

			context.meta.$statusCode =
				getReceiptReceivedConfirmationResponse.status;

			loggerElastic(
				this.indexName,
				String(getReceiptReceivedConfirmationResponse.status),
				this.originLayer,
				this.serviceName,
				JSON.stringify(`get - ${this.receiptReceivedConfirmationUrl}`),
				JSON.stringify(getReceiptReceivedConfirmationResponse)
			);

			apmElasticConnect.endTransaction([
				this.receiptReceivedConfirmationUrl
			]);

			return getReceiptReceivedConfirmationResponse.message;
		} catch (error) {
			const errorStatus = error?.status || error?.code || 400;

			loggerElastic(
				this.indexName,
				String(errorStatus),
				this.originLayer,
				this.serviceName,
				JSON.stringify(`get - ${this.receiptReceivedConfirmationUrl}`),
				JSON.stringify(error)
			);

			context.meta.$statusCode = +errorStatus;

			apmElasticConnect.endTransaction([
				this.receiptReceivedConfirmationUrl
			]);
			return error;
		}
	}

	@Action({
		cache: false,
		rest: 'PUT receipt-received/',
		name: 'service.alcis.put-receipt-received',
		group: 'flow-alcis'
	})
	public async putReceiptReceivedConfirmation(context: any) {
		apmElasticConnect.startTransaction(
			'IA Version 1 => Alcis - PUT Receipt Received Confirmation',
			'request'
		);
		const putBody: IReceiptReceivedConfirmation = context.params;

		loggerElastic(
			this.indexName,
			'200',
			this.originLayer,
			this.serviceName,
			JSON.stringify(`put - ${this.receiptReceivedConfirmationUrl}`),
			JSON.stringify(putBody)
		);

		try {
			const putResponse = await alcisRequestController(
				this.receiptReceivedConfirmationUrl,
				putBody,
				'Authorization',
				'put'
			);

			if (putResponse instanceof Error) {
				throw putResponse;
			}

			context.meta.$statusCode = putResponse.status;

			loggerElastic(
				this.indexName,
				String(putResponse.status),
				this.originLayer,
				this.serviceName,
				JSON.stringify(`put - ${JSON.stringify(putBody)}`),
				JSON.stringify(putResponse)
			);

			apmElasticConnect.endTransaction([
				this.receiptReceivedConfirmationUrl
			]);

			return putResponse.message;
		} catch (error) {
			const errorStatus = error?.status || error?.code || 400;

			loggerElastic(
				this.indexName,
				String(errorStatus),
				this.originLayer,
				this.serviceName,
				JSON.stringify(`put - ${JSON.stringify(putBody)}`),
				JSON.stringify(error)
			);

			context.meta.$statusCode = +errorStatus;

			apmElasticConnect.endTransaction([
				this.receiptReceivedConfirmationUrl
			]);
			return error;
		}
	}

	@Action({
		cache: false,
		rest: 'PUT receipt-received-confirmation/',
		name: 'service.alcis.put-receive-receipt-confirmation',
		group: 'flow-alcis'
	})
	public async putReceiveReceipt(context: any) {
		apmElasticConnect.startTransaction(
			'IA Version 1 => Protheus - PUT Receipt Received',
			'request'
		);

		const viaCronJob =
			process.env.ALCIS_PROTHEUS_RECEIVE_RECEIPT_VIA_CRON == 'true';
		const putBody: IReceiveReceipt = context.params;

		loggerElastic(
			this.indexName,
			'200',
			this.originLayer,
			'IA Version 1 => Protheus - PUT Receipt Received - Via CronJob:' +
				viaCronJob,
			JSON.stringify('Recebido do Alcis PUT: ' + putBody),
			''
		);

		if (viaCronJob) {
			try {
				const createReceiptConfirmation: IIReceiptReceivedConfirmation =
					await ReceiveReceiptRepository.PostOrders(putBody);

				apmElasticConnect.endTransaction([this.serviceName]);

				loggerElastic(
					this.indexName,
					String(createReceiptConfirmation.status),
					this.originLayer,
					'IA Version 1 => Protheus - PUT Receipt Received',
					JSON.stringify('Resultado Gravação da Reserva'),
					JSON.stringify(createReceiptConfirmation.message)
				);

				if (createReceiptConfirmation.status == 200) {
					return Promise.resolve(createReceiptConfirmation);
				} else {
					return Promise.reject(
						new Errors.MoleculerError(
							createReceiptConfirmation.message,
							424
						)
					);
				}
			} catch (error) {
				loggerElastic(
					this.indexName,
					'499',
					this.originLayer,
					this.serviceName,
					JSON.stringify(
						'Erro Processo Recebido do Alcis PUT: ' + putBody
					),
					JSON.stringify(error)
				);

				apmElasticConnect.endTransaction([this.serviceName]);

				return Promise.reject(
					new Errors.MoleculerError(error.message, 424)
				);
			}
		} else {
			let receiveReceiptProtheusUrl;

			try {
				if (
					putBody.site.charAt(0) ==
					process.env.PROTHEUS_ALCIS_GKO_MAFRA_SITE
				) {
					receiveReceiptProtheusUrl =
						process.env.PROTHEUS_ALCIS_GKO_BASEURL_MAFRA +
						process.env.PROTHEUS_ALCIS_GKO_RECEIVE_RECEIPT;
				} else {
					receiveReceiptProtheusUrl =
						process.env.PROTHEUS_ALCIS_GKO_BASEURL_CREMER +
						process.env.PROTHEUS_ALCIS_GKO_RECEIVE_RECEIPT;
				}

				const requestOptions = {
					urlSend: receiveReceiptProtheusUrl,
					bodySend: putBody,
					nameToken: 'Authorization',
					methodAxios: 'put' as const
				};

				const putResponseToProtheus =
					await alcisRequestProtheusController(requestOptions);

				loggerElastic(
					this.indexName,
					'200',
					this.originLayer,
					this.serviceName,
					JSON.stringify(`put - ${receiveReceiptProtheusUrl}`),
					JSON.stringify(putBody)
				);

				if (putResponseToProtheus instanceof Error) {
					throw putResponseToProtheus;
				}

				if (putResponseToProtheus.status == 400)
					putResponseToProtheus.status = 425;
				context.meta.$statusCode = putResponseToProtheus?.status || 400;

				loggerElastic(
					this.indexName,
					String(putResponseToProtheus?.status || 400),
					this.originLayer,
					this.serviceName,
					JSON.stringify(`put - ${JSON.stringify(putBody)}`),
					JSON.stringify(
						putResponseToProtheus || {
							erro: 'Resposta não recebida corretamente'
						}
					)
				);
				apmElasticConnect.endTransaction([receiveReceiptProtheusUrl]);

				return putResponseToProtheus.message;
			} catch (error) {
				const errorStatus = error?.status || error?.code || 400;

				loggerElastic(
					this.indexName,
					String(errorStatus),
					this.originLayer,
					this.serviceName,
					JSON.stringify(`put - ${JSON.stringify(putBody)}`),
					JSON.stringify(error)
				);

				context.meta.$statusCode = +errorStatus;

				apmElasticConnect.endTransaction([this.serviceName]);
				return error;
			}
		}
	}

	@Event({
		name: 'ProcessProtheusReceiveReceipt',
		group: 'cronJobs-flow'
	})
	public async CallGenerate(ctx: any) {
		try {
			loggerElastic(
				this.indexName,
				'200',
				this.originLayer,
				'IA Version 1 => CronJob => Protheus - PUT Receipt Received',
				JSON.stringify('CronJob Iniciado'),
				JSON.stringify(ctx)
			);

			await setTransaction(
				Boolean(process.env.ALCIS_PROTHEUS_RECEIPT_RECEIVED_ACTIVE)
			);
		} catch (error) {
			loggerElastic(
				this.indexName,
				'499',
				this.originLayer,
				'IA Version 1 => CronJob => Protheus - PUT Receipt Received',
				JSON.stringify('CronJob Erro'),
				JSON.stringify(error)
			);
		}
	}
}
