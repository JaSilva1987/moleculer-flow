'use strict';

import * as dotenv from 'dotenv';
import {
	Context,
	Errors,
	Service as MoleculerService,
	ServiceBroker
} from 'moleculer';
import { alcisRequestController } from '../../../src/controller/alcis/services/alcisRequest.controller';
import { apmElasticConnect, loggerElastic } from '../../library/elasticSearch';
import { IOrderConfirmation } from '../../../src/interface/alcis/order/orderConfirmation/newConfirmationOrder.interface';
import { IIOrderConfirmation } from '../../../src/interface/alcis/order/orderConfirmation/orderConfirmation.interface';
import { OrderConfirmationRepository } from '../../../src/repository/integration/order/orderConfirmation.repository';
import { CronJob } from 'cron';

dotenv.config();

export default class orderConfirmationData extends MoleculerService {
	public constructor(public broker: ServiceBroker) {
		super(broker);

		this.parseServiceSchema({
			name: 'alcis-order-confirmation',
			group: 'flow-alcis',
			actions: {
				put: {
					cache: false,
					rest: {
						method: 'PUT',
						basePath: 'alcis-order-confirmation/',
						path: 'order-confirmation'
					},
					async handler(cteMessage: Context<any>) {
						return await this.putOrderConfirmation(cteMessage);
					}
				},
				update: {
					cache: false,
					rest: {
						method: 'PUT',
						basePath: 'alcis-order-confirmation/',
						path: 'confirm-order'
					},
					async handler(cteMessage: Context<any>) {
						return await this.putOrderConfirmationAlcis(cteMessage);
					}
				},
				get: {
					cache: false,
					rest: {
						method: 'GET',
						basePath: 'alcis-order-confirmation/',
						path: 'order-confirmation'
					},
					async handler(cteMessage: Context<any>) {
						return await this.getOrderConfirmations(cteMessage);
					}
				}
			}
		});
	}

	public indexName = 'flow-alcis-order-confirmation';
	public serviceName = 'order-confirmation.service';
	public originLayer = 'alcis';
	public cronJobOne: CronJob;

	private orderConfirmationUrlProtheus =
		process.env.ALCIS_BASE_URL + process.env.ALCIS_ORDER_CONFIRMATION_URL;

	private orderConfirmationUrlAlcis =
		process.env.ALCIS_BASE_URL + process.env.ALCIS_ORDER_CONFIRM_URL;

	public async putOrderConfirmation(cteMessage: Context<any>) {
		apmElasticConnect.startTransaction(
			'IA Version 1 => Protheus - PUT Order Confirmation',
			'request'
		);

		const putBody: IOrderConfirmation = cteMessage.params;

		loggerElastic(
			this.indexName,
			'200',
			this.originLayer,
			'IA Version 1 => Protheus - PUT Order Confirmation',
			JSON.stringify('Recebido do Alcis PUT: ' + putBody),
			''
		);

		try {
			const createOrder: IIOrderConfirmation =
				await OrderConfirmationRepository.PostOrders(putBody);

			loggerElastic(
				this.indexName,
				String(createOrder.status),
				this.originLayer,
				'IA Version 1 => Protheus - PUT Order Confirmation',
				JSON.stringify('Resultado Gravação da Reserva'),
				JSON.stringify(createOrder.message)
			);
			apmElasticConnect.endTransaction([this.serviceName]);

			if (createOrder.status == 200) {
				return Promise.resolve(createOrder);
			} else {
				return Promise.reject(
					new Errors.MoleculerError(createOrder.message, 424)
				);
			}
		} catch (error) {
			loggerElastic(
				this.indexName,
				'499',
				this.originLayer,
				this.serviceName,
				JSON.stringify(
					'Erro Processo Recebido do Protheus PUT Order Confirmation: ' +
						putBody
				),
				JSON.stringify(error)
			);

			apmElasticConnect.endTransaction([this.serviceName]);

			return Promise.reject(
				new Errors.MoleculerError(error.message, 424)
			);
		}
	}

	public async putOrderConfirmationAlcis(cteMessage: Context<any>) {
		apmElasticConnect.startTransaction(
			'IA Version 1 => Alcis - PUT Order Confirmation',
			'request'
		);
		const ctxBody = cteMessage.params;

		await loggerElastic(
			this.indexName,
			'200',
			this.originLayer,
			this.serviceName,
			JSON.stringify(`put - ${this.orderConfirmationUrlAlcis}`),
			JSON.stringify({ body: ctxBody })
		);

		try {
			const putResponse = await alcisRequestController(
				this.orderConfirmationUrlAlcis,
				ctxBody,
				'Authorization',
				'put',
				null,
				null,
				null,
				null,
				null
			);

			if (putResponse instanceof Error) {
				await loggerElastic(
					this.indexName,
					String(putResponse?.status || 400),
					this.originLayer,
					this.serviceName,
					JSON.stringify(`put - ${JSON.stringify(ctxBody)}`),
					JSON.stringify(
						putResponse || {
							erro: 'Resposta não recebida corretamente'
						}
					)
				);

				throw new Error(putResponse.message);
			}

			apmElasticConnect.endTransaction([this.orderConfirmationUrlAlcis]);

			if (putResponse?.status == 200) {
				return Promise.resolve(putResponse.message);
			} else {
				return Promise.reject(
					new Errors.MoleculerError(
						putResponse.message,
						putResponse?.status != undefined
							? putResponse?.status
							: 400
					)
				);
			}
		} catch (error) {
			apmElasticConnect.endTransaction([this.orderConfirmationUrlAlcis]);
			const errorStatus = error?.status || error?.code || 400;

			await loggerElastic(
				this.indexName,
				String(errorStatus),
				this.originLayer,
				this.serviceName,
				JSON.stringify(`put - ${JSON.stringify(ctxBody)}`),
				JSON.stringify(error)
			);

			return Promise.reject(
				new Errors.MoleculerError(error.message, 400)
			);
		}
	}

	public async getOrderConfirmations(cteMessage: Context<any>) {
		apmElasticConnect.startTransaction(
			'IA Version 1 => Alcis - GET Order Confirmation',
			'request'
		);

		const ctxQuery = cteMessage.params;

		loggerElastic(
			this.indexName,
			'200',
			this.originLayer,
			this.serviceName,
			JSON.stringify(`get - ${this.orderConfirmationUrlProtheus}`),
			JSON.stringify({ body: ctxQuery })
		);

		try {
			const getOrderConfirmationResponse = await alcisRequestController(
				this.orderConfirmationUrlProtheus,
				null,
				'Authorization',
				'get',
				null,
				null,
				null,
				null,
				ctxQuery
			);

			if (getOrderConfirmationResponse instanceof Error) {
				loggerElastic(
					this.indexName,
					String(getOrderConfirmationResponse?.status || 400),
					this.originLayer,
					this.serviceName,
					JSON.stringify(`put - ${JSON.stringify(ctxQuery)}`),
					JSON.stringify(
						getOrderConfirmationResponse || {
							erro: 'Resposta não recebida corretamente'
						}
					)
				);

				throw new Error(getOrderConfirmationResponse.message);
			}

			apmElasticConnect.endTransaction([
				this.orderConfirmationUrlProtheus
			]);

			if (
				getOrderConfirmationResponse?.status >= 200 &&
				getOrderConfirmationResponse?.status <= 299
			) {
				return Promise.resolve(getOrderConfirmationResponse.message);
			} else {
				return Promise.reject(
					new Errors.MoleculerError(
						getOrderConfirmationResponse.message,
						getOrderConfirmationResponse?.status != undefined
							? getOrderConfirmationResponse?.status
							: 400
					)
				);
			}
		} catch (error) {
			apmElasticConnect.endTransaction([
				this.orderConfirmationUrlProtheus
			]);
			const errorStatus = error?.status || error?.code || 400;

			await loggerElastic(
				this.indexName,
				String(errorStatus),
				this.originLayer,
				this.serviceName,
				JSON.stringify(`put - ${JSON.stringify(ctxQuery)}`),
				JSON.stringify(error)
			);

			apmElasticConnect.endTransaction([
				this.orderConfirmationUrlProtheus
			]);

			return Promise.reject(
				new Errors.MoleculerError(error.message, 400)
			);
		}
	}
}
