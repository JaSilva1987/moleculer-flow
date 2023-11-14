import { ISaveOrders } from './../../../src/interface/integration/order/saveOrder.interface';
import { IParamsFunctional } from './../../../src/interface/funcional/params/paramsFuncional.interface';
import {
	StatusIntegrador,
	StatusIntegradorFuncional
} from '../../../src/enum/integration/enum';
import {
	Errors,
	ServiceBroker,
	ServiceSchema,
	Service as MoleculerService,
	Context
} from 'moleculer';
import * as dotenv from 'dotenv';
dotenv.config();
import { Event, Service } from 'moleculer-decorators';
import {
	IGetOrdersFuncional,
	IOrdersFuncional,
	IOrdersMoneyFuncional,
	IOrdersProtheus
} from '../../../src/interface/funcional/order/ordersFuncional.interface';
import { connectionIntegrador } from '../../../src/data-source';
import { SaveOrdersFuncionalRepository } from '../../../src/repository/integration/order/ordersFuncional.repository';
import { NumbersProtheus, SystemasViveo } from '../../../src/enum/global/enum';
import { INewStatus } from '../../../src/interface/funcional/order/statusFuncional.interface';
import OrdersFuncionalController from '../../../src/controller/integration/order/ordersFuncional.controller';
import OrdersFuncionalBusinessRule from '../../../src/controller/integration/order/ordersFuncional.controller';
import { formatDate } from '../../library/dateTime/formatDateTime';
import { apmElasticConnect, loggerElastic } from '../../library/elasticSearch';

@Service({
	name: 'funcional.integration.orders',
	group: 'flow-funcional'
})
export default class OrdersPostFuncionalService extends MoleculerService {
	public constructor(public broker: ServiceBroker, schema: ServiceSchema) {
		super(broker);
	}
	instanceController: OrdersFuncionalController;
	moneyValidator: any | object;
	responseMoney: any | object;
	objMoney: object;
	objResponse: any | object;
	objMResponse: object;
	objEResponse: object;
	eventReturn: object;
	globalReturn: any | object;
	indexName = 'flow-funcional-orders';
	isCode = '200';
	originLayer = 'integration';
	serviceNamePost = 'OrdersFuncionalService OrdersPost';
	serviceNameGet = 'OrdersFuncionalService OrdersGet';
	serviceNamePut = 'OrdersFuncionalService OrdersPut';
	serviceNameSchedule = 'OrdersFuncionalService Schedule';
	serviceNameCron = 'OrdersFuncionalService CronJob';
	async started() {
		try {
			await connectionIntegrador.initialize();
		} catch (error) {
			throw new Errors.MoleculerError(error.message, 500);
		}
	}

	@Event({
		name: 'funcional.integration.post.orders',
		group: 'flow-funcional'
	})
	public async OrdersPost(messageRec: IOrdersFuncional) {
		try {
			this.responseMoney = await this.broker.emit(
				'funcional.crmmoney.post.orders',
				messageRec
			);

			this.responseMoney.forEach(async (acessParams: any) => {
				const resMoney: IOrdersMoneyFuncional = {
					authorization: acessParams.authorization,
					orders: acessParams.orders
				};

				if (resMoney.authorization == true) {
					this.instanceController = new OrdersFuncionalBusinessRule();
					await this.instanceController.validatesRoutes(resMoney);
				}
			});

			return this.responseMoney;
		} catch (error) {
			return new Errors.MoleculerError(error.message, error.code);
		}
	}

	@Event({
		name: 'service.integration.ordersFuncionalPut',
		group: 'flow-funcional'
	})
	public async OrdersPut(messageRec: Context<IParamsFunctional>) {
		try {
			const ctxMessage = messageRec.params;

			for (let i = 0; i < ctxMessage.orders.length; i++) {
				this.postMesssage = {
					tenantId: String(ctxMessage.orders[i].companyID),
					orderId: String(ctxMessage.orders[i].preAuthorizationCode),
					sourceCRM: SystemasViveo.crmFuncional,
					createdAt: new Date(),
					updatedAt: new Date(),
					json_order: ctxMessage.orders[i],
					branchId: String(ctxMessage.orders[i].branchID),
					orderIdERP: null,
					status: StatusIntegradorFuncional.updateOrder
				};

				this.insertOrders =
					await SaveOrdersFuncionalRepository.PutOrdersFuncional(
						this.postMesssage
					);

				loggerElastic(
					this.indexName,
					this.isCode,
					this.originLayer,
					this.serviceNamePut,
					JSON.stringify(messageRec),
					JSON.stringify(this.postMesssage)
				);
			}
		} catch (error) {
			loggerElastic(
				this.indexName,
				error.code,
				this.originLayer,
				this.serviceNamePut,
				JSON.stringify(messageRec),
				JSON.stringify(error.message)
			);
			apmElasticConnect.captureError(new Error(error.message));
			throw new Errors.MoleculerError(
				process.env.MESSAGE_FUNCIONAL_THROW,
				401
			);
		}
	}

	@Event({
		name: 'funcional.integration.cron.orders',
		group: 'flow-funcional'
	})
	public async OrdersPostCron(statusCron: string) {
		try {
			if (Boolean(statusCron) == true) {
				const envProtheus =
					await SaveOrdersFuncionalRepository.CheckOrdersFuncional(
						SystemasViveo.crmFuncional,
						StatusIntegrador.receivedOrigin
					);

				if (Array.isArray(envProtheus)) {
					envProtheus.forEach(
						async (element: {
							tenantId: any;
							branchId: any;
							json_order: any;
						}) => {
							const JsonSend: IOrdersProtheus = {
								codeCompany: element.tenantId,
								codeSubsidiary: element.branchId,
								jsonEnv: JSON.stringify(
									JSON.parse(element.json_order)
								),
								methodSend: 'POST'
							};

							if (
								JsonSend.codeCompany ==
								process.env.PROTHEUS_EXPRESSA
							) {
								await this.broker.broadcast(
									'funcional.erpprotheusexpressa.post.orders',
									JsonSend
								);
							} else if (
								JsonSend.codeCompany ==
								process.env.PROTHEUS_VIVEO
							) {
								await this.broker.broadcast(
									'funcional.erpprotheusviveo.post.orders',
									JsonSend
								);
							}
						}
					);
				}

				const retryProtheus =
					await SaveOrdersFuncionalRepository.CheckOrdersFuncional(
						SystemasViveo.crmFuncional,
						StatusIntegrador.retryProtheus
					);

				if (Array.isArray(retryProtheus)) {
					retryProtheus.forEach(
						async (element: {
							tenantId: any;
							branchId: any;
							json_order: any;
						}) => {
							const JsonSend: IOrdersProtheus = {
								codeCompany: element.tenantId,
								codeSubsidiary: element.branchId,
								jsonEnv: JSON.stringify(
									JSON.parse(element.json_order)
								),
								methodSend: 'POST'
							};

							if (
								JsonSend.codeCompany ==
								process.env.PROTHEUS_EXPRESSA
							) {
								await this.broker.broadcast(
									'funcional.erpprotheusexpressa.post.orders',
									JsonSend
								);
							} else if (
								JsonSend.codeCompany ==
								process.env.PROTHEUS_VIVEO
							) {
								await this.broker.broadcast(
									'funcional.erpprotheusviveo.post.orders',
									JsonSend
								);
							}
						}
					);
				}

				const updateProtheus =
					await SaveOrdersFuncionalRepository.CheckOrdersFuncional(
						SystemasViveo.crmFuncional,
						StatusIntegradorFuncional.updateOrder
					);

				if (Array.isArray(updateProtheus)) {
					updateProtheus.forEach(
						async (element: {
							tenantId: any;
							branchId: any;
							json_order: any;
						}) => {
							const JsonSend: IOrdersProtheus = {
								codeCompany: element.tenantId,
								codeSubsidiary: JSON.stringify(
									JSON.parse(element.json_order)
								),
								jsonEnv: element.json_order,
								methodSend: 'PUT'
							};

							if (
								JsonSend.codeCompany ==
								process.env.PROTHEUS_EXPRESSA
							) {
								await this.broker.broadcast(
									'funcional.erpprotheusexpressa.post.orders',
									JsonSend
								);
							} else if (
								JsonSend.codeCompany ==
								process.env.PROTHEUS_VIVEO
							) {
								await this.broker.broadcast(
									'funcional.erpprotheusviveo.post.orders',
									JsonSend
								);
							}
						}
					);
				}

				const ordersStatus =
					await SaveOrdersFuncionalRepository.GetOrdersStatusFuncional(
						SystemasViveo.crmFuncional
					);

				if (Array.isArray(ordersStatus)) {
					ordersStatus.forEach(async (element) => {
						const JsonSend: INewStatus = {
							cronJob: true,
							methodSend: 'get',
							urlObj: {
								isDate: `Filter=dateTimeUpdate gt '${formatDate(
									new Date()
								)}'`
							}
						};

						if (
							element.tenantId == NumbersProtheus.protheusExpressa
						) {
							await this.broker.broadcast(
								'funcional.erpprotheusexpressa.get.orders',
								JsonSend
							);
						} else if (
							element.tenantId == NumbersProtheus.protheusMafra
						) {
							await this.broker.broadcast(
								'funcional.erpprotheusmafra.get.orders',
								JsonSend
							);
						}
					});
				}
			}
		} catch (error) {
			loggerElastic(
				this.indexName,
				error.code,
				this.originLayer,
				this.serviceNameCron,
				JSON.stringify(true),
				JSON.stringify(error.message)
			);
			apmElasticConnect.captureError(new Error(error.message));
			throw new Errors.MoleculerError(process.env.ERROR_ROUTINE, 105);
		}
	}
	@Event({
		name: 'service.integration.schedule.orders',
		group: 'flow-funcional'
	})
	public async OrdersScheduleProtheus(JsonSendProtheus: INewStatus) {
		try {
			await this.broker.broadcast(
				'funcional.erpprotheusexpressa.get.orders',
				JsonSendProtheus
			);

			await this.broker.broadcast(
				'funcional.erpprotheusmafra.get.orders',
				JsonSendProtheus
			);
		} catch (error) {
			loggerElastic(
				this.indexName,
				error.code,
				this.originLayer,
				this.serviceNamePost,
				JSON.stringify(JsonSendProtheus),
				JSON.stringify(error.message)
			);
			apmElasticConnect.captureError(new Error(error.message));
			throw new Errors.MoleculerError(error.message, 107);
		}
	}

	@Event({
		name: 'service.integration.updateReturnProtheus',
		group: 'flow-funcional'
	})
	public async OrdersUpdateProtheus(objReturn: ISaveOrders) {
		try {
			await SaveOrdersFuncionalRepository.PutStatusFuncional(objReturn);
		} catch (error) {
			loggerElastic(
				this.indexName,
				error.code,
				this.originLayer,
				this.serviceNamePost,
				JSON.stringify(objReturn),
				JSON.stringify(error.message)
			);
			apmElasticConnect.captureError(new Error(error.message));
			throw new Errors.MoleculerError(error.message, 107);
		}
	}

	@Event({
		name: 'service.integration.scheduleEnv',
		group: 'flow-funcional'
	})
	public async StatusOrdersFuncional(objReturn: object) {
		try {
			await this.broker.broadcast(
				'funcional.schedule.funcional.orders',
				objReturn
			);
		} catch (error) {
			loggerElastic(
				this.indexName,
				error.code,
				this.originLayer,
				this.serviceNameSchedule,
				JSON.stringify(objReturn),
				JSON.stringify(error.message)
			);
			apmElasticConnect.captureError(new Error(error.message));
			throw new Errors.MoleculerError(error.message, 107);
		}
	}

	@Event({
		name: 'funcional.integration.get.orders',
		group: 'flow-funcional'
	})
	public async GetOrdersFuncional(messageRec: IGetOrdersFuncional) {
		try {
			this.instanceController = new OrdersFuncionalBusinessRule();
			const resqRespProtheus = await this.instanceController.validateGet(
				messageRec
			);

			const jsonProtheus = await this.instanceController.jsonGetParams(
				messageRec
			);

			switch (resqRespProtheus) {
				case 'mafra':
					this.objResponse = await this.broker.emit(
						'funcional.erpprotheusmafra.get.orders',
						jsonProtheus
					);

					const resMafra =
						await this.instanceController.treatementResponseMafra(
							this.objResponse
						);

					loggerElastic(
						this.indexName,
						this.isCode,
						this.originLayer,
						this.serviceNameGet,
						JSON.stringify(this.objResponse),
						JSON.stringify(resMafra)
					);

					this.globalReturn = resMafra;
					break;
				case 'expressa':
					this.objResponse = await this.broker.emit(
						'funcional.erpprotheusexpressa.get.orders',
						jsonProtheus
					);

					const resExpressa =
						await this.instanceController.treatementResponseExpressa(
							this.objResponse
						);

					loggerElastic(
						this.indexName,
						this.isCode,
						this.originLayer,
						this.serviceNameGet,
						JSON.stringify(this.objResponse),
						JSON.stringify(resExpressa)
					);

					this.globalReturn = resExpressa;
					break;
			}

			if (messageRec.pageNumber != undefined) {
				Object.assign(this.globalReturn.viveo, {
					pageNumber:
						messageRec.pageNumber != undefined
							? messageRec.pageNumber
							: 0,
					pageSize:
						messageRec.pageSize != undefined
							? messageRec.pageSize
							: 0
				});

				loggerElastic(
					this.indexName,
					this.isCode,
					this.originLayer,
					this.serviceNameGet,
					JSON.stringify(messageRec),
					JSON.stringify(this.globalReturn)
				);

				return this.globalReturn;
			} else {
				loggerElastic(
					this.indexName,
					this.isCode,
					this.originLayer,
					this.serviceNameGet,
					JSON.stringify(messageRec),
					JSON.stringify(this.globalReturn)
				);

				return this.globalReturn;
			}
		} catch (error) {
			loggerElastic(
				this.indexName,
				error.code,
				this.originLayer,
				this.serviceNameGet,
				JSON.stringify(messageRec),
				JSON.stringify(error.message)
			);
			apmElasticConnect.captureError(new Error(error.message));
			throw new Errors.MoleculerError(error.message, error.code);
		}
	}
	async stoped() {
		return await connectionIntegrador.destroy();
	}
}
