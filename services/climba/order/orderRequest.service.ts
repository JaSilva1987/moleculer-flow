'use strict';
import {
	Context,
	Service as MoleculerService,
	ServiceBroker,
	ServiceSchema
} from 'moleculer';
import { Action, Event, Service } from 'moleculer-decorators';
import * as dotenv from 'dotenv';
import { apmElasticConnect, loggerElastic } from '../../library/elasticSearch';
import { CronJob } from 'cron';
import { AxiosRequestType } from '../../library/axios';
import {
	IConfirmOrderSuccess,
	IOrderRequest
} from '../../../src/interface/climba/order/orderRequest.interface';
import { differenceInMinutes, format, sub } from 'date-fns';
import Validator from 'fastest-validator';
import { orderRequestSchema } from '../../../src/validator/climba/orderRequest.validator';
import { ILogsRetryIntegration } from '../../../src/interface/integration/logs/logRetryIntegration.interface';
import LogsRetrySystemController from '../../../src/controller/integration/logs/logRetrySystem.controller';

dotenv.config();
@Service({
	name: 'orderRequest-climba',
	group: 'climba-ecommerce'
})
export default class GetOrderRequestClimba extends MoleculerService {
	public constructor(public broker: ServiceBroker, schema: ServiceSchema) {
		super(broker);

		this.cronJobOne = new CronJob(
			process.env.CRON_CLIMBA_GETORDER,
			async () => {
				try {
					this.broker.broadcast(
						'service.climba.orderRequest.getOrderRequest',
						process.env.CLIMBA_REQUEST_ATIVE
					);
				} catch {
					new Error('Cron not run');
				}
			}
		);

		if (!this.cronJobOne.running) this.cronJobOne.start();
	}

	public indexName = 'flow-ecommerce-orderrequest';
	public serviceName = 'climba.order.service';
	public originLayer = 'climbaEcommerce';

	@Event({
		name: 'service.climba.orderRequest.getOrderRequest',
		group: 'flow-climba'
	})
	public async GetOrderRequest(enabled: string) {
		if (enabled === 'true') {
			this.logger.info(
				'==============BUSCA PEDIDO NO CLIMBA - ECOMMERCE=============='
			);
			try {
				const logsController = new LogsRetrySystemController();

				const message: ILogsRetryIntegration = {
					lenght: 0,
					executeDate: new Date(),
					systemName: 'ecommerce-orderRequest'
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
						const responseGetOrder: any = await AxiosRequestType(
							process.env.URL_ECOMMERCE + `orders`,
							'',
							'get',
							{
								'x-idcommerce-api-token':
									process.env.TOKEN_ECOMMERCE
							},
							{
								dateStart: format(
									lastExecutation,
									'yyyy-MM-dd HH:mm:ss'
								),
								dateEnd: format(
									new Date(),
									'yyyy-MM-dd HH:mm:ss'
								),
								status: 2
							}
						);

						if (responseGetOrder.status === 200) {
							message.lenght = responseGetOrder.message.total;
							await logsController.postLogsRetrySystem(message);
							for (const order of responseGetOrder.message.data) {
								const ordersRequest: IOrderRequest = order;

								this.broker.broadcast(
									'ecommerce.integration.orderrequestEcommerce',
									ordersRequest
								);
							}
						}
					}

					loggerElastic(
						this.indexName,
						'200',
						this.originLayer,
						this.serviceName,
						`${process.env.URL_ECOMMERCE}orders`,
						JSON.stringify(getLastExecutation)
					);
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

	@Action({
		cache: false,
		rest: 'POST /',
		name: 'service.climba.orderRequest.postRequestClimba',
		group: 'flow-climba'
	})
	public async postRequestClimba(context: Context<any>) {
		const v = new Validator();
		const check = v.compile(orderRequestSchema);
		const validator = check(context.params);

		if (validator == true) {
			await this.broker.broadcast(
				'service.climba.orderRequest.getOrderRequestByOrderId',
				context.params.orderId
			);
			return await Promise.resolve({
				status: 201,
				message: context.params.orderId
			});
		} else {
			return await Promise.reject({
				status: 400,
				message: validator
			});
		}
	}

	@Event({
		name: 'service.climba.orderRequest.getOrderRequestByOrderId',
		group: 'flow-climba'
	})
	public async GetOrderRequestByOrderId(orderId: string) {
		this.logger.info(
			`==============BUSCA PEDIDO NO CLIMBA PELO ID ${orderId} - ECOMMERCE=============`
		);
		try {
			apmElasticConnect.startTransaction(
				'IE V1 => Climba - GET Order',
				'request'
			);
			const responseGetOrder: any = await AxiosRequestType(
				process.env.URL_ECOMMERCE + `orders/${orderId}`,
				'',
				'get',
				{ 'x-idcommerce-api-token': process.env.TOKEN_ECOMMERCE },
				{ status: 2 }
			);
			apmElasticConnect.endTransaction(responseGetOrder);
			if (responseGetOrder.status === 200) {
				const ordersRequest: IOrderRequest = responseGetOrder.message;

				this.broker.broadcast(
					'ecommerce.integration.orderrequestEcommerce',
					ordersRequest
				);
			}

			loggerElastic(
				this.indexName,
				responseGetOrder.status.toString(),
				this.originLayer,
				this.serviceName,
				`${process.env.URL_ECOMMERCE}orders`,
				JSON.stringify(responseGetOrder)
			);
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

	@Event({
		name: 'service.climba.order.confirmOrder',
		group: 'flow-climba'
	})
	public async confirmOrder(message: IConfirmOrderSuccess) {
		this.logger.info(
			`==============CONFIRMA O RECEBIMENTO DA ORDER ID ${message.orderId} - ECOMMERCE=============`
		);
		try {
			const responseGetOrder: any = await AxiosRequestType(
				process.env.URL_ECOMMERCE + `orders/${message.orderId}`,
				message.orderConfirm,
				'patch',
				{ 'x-idcommerce-api-token': process.env.TOKEN_ECOMMERCE }
			);

			if (responseGetOrder.status === 200) {
				const ordersRequest: IOrderRequest = responseGetOrder.message;

				this.broker.broadcast(
					'ecommerce.integration.orderrequestEcommerce',
					ordersRequest
				);
			}

			loggerElastic(
				this.indexName,
				responseGetOrder.status.toString(),
				this.originLayer,
				this.serviceName,
				`${process.env.URL_ECOMMERCE}orders`,
				JSON.stringify(responseGetOrder)
			);
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
