'use strict';

import {
	Errors,
	Service as MoleculerService,
	ServiceBroker,
	ServiceSchema
} from 'moleculer';
import { Event, Method, Service } from 'moleculer-decorators';
import moment from 'moment';
import { StatusIso } from '../../../src/enum/crmIso/enum';
import { StatusIntegrador } from '../../../src/enum/integration/enum';
import { IConfigLogCrmIso } from '../../../src/interface/crmIso/config/configLog.interface';
import { IUpdateOrders } from '../../../src/interface/crmIso/order/updateOrder.interface';
import {
	IGetProductUnitProduct,
	IGetUnitProduct
} from '../../../src/interface/erpProtheus/product/unitProduct.interface';
import {
	IAItemPedido,
	IALotePorItem,
	IAPagamento,
	IGenerateOrders,
	IGenerateSend,
	IOF
} from '../../../src/interface/integration/order/ordersGenerate.interface';
import { ISaveOrders } from '../../../src/interface/integration/order/saveOrder.interface';
import { OrderCheckRepository } from '../../../src/repository/integration/order/orderCheck.repository';
import { SaveOrdersCrmIsoRepository } from '../../../src/repository/integration/order/orders.repository';
import { loggerElastic } from '../../library/elasticSearch';
import { IGetToken } from '../../../src/interface/erpProtheus/global';
import { clearJson, getTokenUrlGlobal } from '../../library/erpProtheus';
import { AxiosRequestType } from '../../library/axios';
import { differenceInMinutes, format, sub } from 'date-fns';
import LogsRetrySystemController from '../../../src/controller/integration/logs/logRetrySystem.controller';
import { ILogsRetryIntegration } from '../../../src/interface/integration/logs/logRetryIntegration.interface';

@Service({
	name: 'service.integration.order.saveOrdersCrmIso',
	group: 'flow-cremmer-integration'
})
export default class OrdersService extends MoleculerService {
	public noClient = 'Não existe ordem';
	public indexName = 'flow-integration-routeorders';
	public serviceName = 'saveOrders.service';
	public originLayer = 'integration';
	public statusElastic = '200';
	public returnEmpty = 'There is no data in the IsoCrm query';
	public dateSql = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
	public allOrders: ISaveOrders;
	public insertOrders: Object;
	public putOrders: Object;
	public postMesssage: any;
	public sendGenerate: any;
	public consumerGet: any;
	public paramsUp: any;
	public paramsUpIso: any;
	public unityGet: any;
	public sendGenerateUni: any;
	public messageConsumer: any;

	public constructor(public broker: ServiceBroker, schema: ServiceSchema) {
		super(broker);
	}

	@Event({
		name: 'service-integration-order-saveOrdersCrmIso',
		group: 'flow-cremmer'
	})
	public async SaveOrdersCrmIso(ctx: any) {
		try {
			await this.integrationOrdersCrmIso(ctx.params);
		} catch (error) {
			loggerElastic(
				this.indexName,
				'499',
				this.originLayer,
				this.serviceName,
				'',
				JSON.stringify(error.message)
			);
		}
	}

	@Method
	public async integrationOrdersCrmIso(message: any) {
		try {
			this.allOrders = await SaveOrdersCrmIsoRepository.GetAllByOrders(
				message.cEmpresa,
				message.cNumCRM,
				message.cOrigem
			);

			if (this.allOrders != null) {
				if (
					this.allOrders.status != StatusIntegrador.consumerValid &&
					this.allOrders.status != StatusIntegrador.productValid
				) {
					this.putOrders =
						await SaveOrdersCrmIsoRepository.PutByOrders(message);
					loggerElastic(
						this.indexName,
						this.statusElastic,
						this.originLayer,
						this.serviceName,
						JSON.stringify(message)
					);
				}
			} else {
				this.postMesssage = {
					tenantId: String(message.cEmpresa),
					orderId: String(message.cNumCRM),
					sourceCRM: message.cOrigem,
					createdAt: new Date(),
					updatedAt: new Date(),
					json_order: JSON.stringify(message),
					branchId: String(message.cBranchId),
					orderIdERP: null,
					status: StatusIntegrador.receivedOrigin
				};

				await SaveOrdersCrmIsoRepository.PostByOrders(
					this.postMesssage
				);

				loggerElastic(
					this.indexName,
					this.statusElastic,
					this.originLayer,
					this.serviceName,
					JSON.stringify(message)
				);
			}

			const sendMessage: IUpdateOrders = {
				cEmpresa: message.cEmpresa,
				cNumCRM: message.cNumCRM,
				enumStatusIso: String(StatusIso.sixteen)
			};

			await this.broker.broadcast(
				'service-crmiso-order-updateCrmIsoStatus',
				sendMessage
			);

			const logIso: IConfigLogCrmIso = {
				orderId: message.cNumCRM,
				name: 'Atualização status ISO',
				status: 'OK',
				description: 'Status ' + String(StatusIso.sixteen),
				dateTimeSav: new Date(),
				dateTimeEvt: new Date(),
				branchId: null,
				orderIdERP: null,
				errorType: null,
				userViewer: null
			};

			await this.broker.broadcast('service.crmIso.saveLogCrmIso', logIso);
		} catch (error) {
			loggerElastic(
				this.indexName,
				'499',
				this.originLayer,
				this.serviceName,
				JSON.stringify(error.message)
			);
		}
	}

	@Event({
		name: 'service-integration-order-starGetConsumer',
		group: 'flow-cremmer'
	})
	public async StartGetConsumer(ctx: any) {
		this.logger.info(
			'================> INICIO STARTGETCONSUMER <================'
		);
		try {
			if (Boolean(ctx.params) == true) {
				const logsController = new LogsRetrySystemController();

				let logRetryMessage: ILogsRetryIntegration = {
					lenght: 0,
					executeDate: new Date(),
					systemName: 'flow-crmIso-getConsumer'
				};

				const getLastExecutation =
					await logsController.getLogsRetrySystem(
						logRetryMessage.systemName
					);

				if (getLastExecutation.length > 0) {
					const lastExecutation = getLastExecutation[0].executeDate;
					const difDate = differenceInMinutes(
						new Date(),
						lastExecutation
					);

					if (difDate >= 1) {
						this.sendGenerate =
							await SaveOrdersCrmIsoRepository.GetByAllStatus(
								StatusIntegrador.receivedOrigin,
								format(lastExecutation, 'yyyy-MM-dd HH:mm:ss'),
								format(new Date(), 'yyyy-MM-dd HH:mm:ss')
							);

						logRetryMessage.lenght = this.sendGenerate.length;

						await logsController.postLogsRetrySystem(
							logRetryMessage
						);

						if (
							typeof this.sendGenerate != 'undefined' &&
							this.sendGenerate != null &&
							this.sendGenerate != '' &&
							this.sendGenerate.length > 0
						) {
							for (let i = 0; i < this.sendGenerate.length; i++) {
								this.consumerGet = JSON.parse(
									this.sendGenerate[i].json_order
								);

								this.messageConsumer = {
									codeClient: this.consumerGet.cCodCliente,
									codStore: this.consumerGet.cLoja,
									orderId: this.consumerGet.cNumCRM
								};

								await this.broker.broadcast(
									'service.erpProtheusViveo.consumer.getConsumer',
									this.messageConsumer
								);

								loggerElastic(
									this.indexName,
									'200',
									this.originLayer,
									this.serviceName,
									JSON.stringify(this.messageConsumer)
								);
							}
						}
					}
				} else {
					logRetryMessage.executeDate = new Date(
						format(
							sub(new Date(), { minutes: 2 }),
							'yyyy-MM-dd HH:mm:ss.000'
						)
					);

					await logsController.postLogsRetrySystem(logRetryMessage);
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
		}
	}

	@Event({
		name: 'service-integration-order-startGetUnity',
		group: 'flow-cremmer'
	})
	public async GetUnityProduct(ctx: any) {
		this.logger.info('========STARTGETUNITY========');
		try {
			if (Boolean(ctx.params) == true) {
				const logsController = new LogsRetrySystemController();

				let logRetryMessage: ILogsRetryIntegration = {
					lenght: 0,
					executeDate: new Date(),
					systemName: 'flow-crmIso-getUnitProduct'
				};

				const getLastExecutation =
					await logsController.getLogsRetrySystem(
						logRetryMessage.systemName
					);

				if (getLastExecutation.length > 0) {
					const lastExecutation = getLastExecutation[0].executeDate;
					const difDate = differenceInMinutes(
						new Date(),
						lastExecutation
					);

					if (difDate >= 1) {
						this.sendGenerateUni =
							await SaveOrdersCrmIsoRepository.GetByAllStatus(
								StatusIntegrador.consumerValid,
								format(lastExecutation, 'yyyy-MM-dd HH:mm:ss'),
								format(new Date(), 'yyyy-MM-dd HH:mm:ss')
							);

						logRetryMessage.lenght = this.sendGenerateUni.length;

						await logsController.postLogsRetrySystem(
							logRetryMessage
						);

						if (
							typeof this.sendGenerateUni != 'undefined' &&
							this.sendGenerateUni != null &&
							this.sendGenerateUni != '' &&
							this.sendGenerateUni.length > 0
						) {
							for (
								let i = 0;
								i < this.sendGenerateUni.length;
								i++
							) {
								this.unityGet = JSON.parse(
									this.sendGenerateUni[i].json_order
								);

								let produts: IGetUnitProduct;
								let unitProducts: IGetProductUnitProduct[] = [];
								for (
									let j = 0;
									j < this.unityGet.aItemPedido.length;
									j++
								) {
									this.messageUnit =
										this.unityGet.aItemPedido[j];

									let unitProduct: IGetProductUnitProduct = {
										Produto: this.messageUnit.cProduto,
										UMOrigem: this.messageUnit.UMOrigem,
										UMDestino:
											this.messageUnit.cUMComercial,
										FatorConversao:
											this.messageUnit.FatorConversao
									};

									unitProducts.push(unitProduct);
								}

								produts = {
									Produtos: unitProducts,
									DTFaturamento:
										this.messageUnit.dDtFaturamentoItem,
									TenantId: `${this.unityGet.cEmpresa},${this.unityGet.cBranchId}`,
									orderId: this.unityGet.cNumCRM
								};

								await this.broker.broadcast(
									'service.erpProtheusViveo.getUnitProduct',
									produts
								);

								loggerElastic(
									this.indexName,
									'200',
									this.originLayer,
									this.serviceName,
									JSON.stringify(produts)
								);
							}
						}
					}
				} else {
					logRetryMessage.executeDate = new Date(
						format(
							sub(new Date(), { minutes: 2 }),
							'yyyy-MM-dd HH:mm:ss.000'
						)
					);

					await logsController.postLogsRetrySystem(logRetryMessage);
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
		}
	}

	@Event({
		name: 'service-integration-sendGenerateOf',
		group: 'flow-cremmer-integration'
	})
	public async SendGenerateOf(ctx: any) {
		this.logger.info('========SENDGENERATEOF========');
		const verifyDate = new Date('1984-01-01');
		try {
			if (Boolean(ctx.params) == true) {
				const logsController = new LogsRetrySystemController();

				let logRetryMessage: ILogsRetryIntegration = {
					lenght: 0,
					executeDate: new Date(),
					systemName: 'flow-crmIso-sendGenerateOf'
				};

				const getLastExecutation =
					await logsController.getLogsRetrySystem(
						logRetryMessage.systemName
					);

				if (getLastExecutation.length > 0) {
					const lastExecutation = getLastExecutation[0].executeDate;
					const difDate = differenceInMinutes(
						new Date(),
						lastExecutation
					);

					if (difDate >= 1) {
						const postGenerateOfs =
							await SaveOrdersCrmIsoRepository.GetByAllStatus(
								StatusIntegrador.productValid,
								format(lastExecutation, 'yyyy-MM-dd HH:mm:ss'),
								format(new Date(), 'yyyy-MM-dd HH:mm:ss')
							);

						logRetryMessage.lenght = postGenerateOfs.length;

						await logsController.postLogsRetrySystem(
							logRetryMessage
						);

						if (postGenerateOfs.length > 0) {
							for (const postGenerateOf of postGenerateOfs) {
								const OF: IOF = {
									...JSON.parse(postGenerateOf.json_order)
								};

								this.logger.trace(
									`Pedido ${postGenerateOf.orderId}`
								);

								const updateIntegrador = {
									status: StatusIntegrador.awaitProcess,
									tenantId: postGenerateOf.tenantId,
									orderId: postGenerateOf.orderId,
									updatedAt: new Date(),
									sourceCRM: 'ISOCRM'
								};

								await this.broker.broadcast(
									'service-integration-updatedStatus',
									updateIntegrador
								);

								const orderCheck =
									await OrderCheckRepository.GetOrderCheckByPrimaryColumns(
										postGenerateOf.tenantId,
										postGenerateOf.orderId,
										postGenerateOf.sourceCRM,
										'dados_clientes'
									);

								const commandSent = JSON.parse(
									orderCheck[0].commandSent
								);

								OF.cRedespXML = 'N';
								OF.cFatAutomatico = ' ';
								OF.cVendedor = commandSent.CodigoVendedor;
								OF.cEstrutCom = 'REP';
								OF.cUsrCRM = 'MIGRA01';
								OF.cOperMafra = 'B1';
								OF.cNicho = commandSent.Nicho;
								OF.cSubNicho = commandSent.SubNicho;
								OF.cHoraIntegracao = moment(new Date()).format(
									'HH:mm:ss'
								);

								const dDtFaturamento = new Date(
									OF.dDtFaturamento + ' 03:00:00'
								);
								if (dDtFaturamento < verifyDate) {
									OF.dDtFaturamento =
										moment(verifyDate).format('YYYYMMDD');
								} else {
									OF.dDtFaturamento =
										moment(dDtFaturamento).format(
											'YYYYMMDD'
										);
								}

								let itemPedido: IAItemPedido[] = [];
								for (const item of OF.aItemPedido) {
									let arrayLotePorItem: IALotePorItem[] = [];

									for (const aLoteItem of item.aLotePorItem) {
										const loteItem: IALotePorItem = {
											...aLoteItem
										};

										arrayLotePorItem.push(loteItem);
									}

									item.aLotePorItem = arrayLotePorItem;

									const dDtFaturamentoItem = new Date(
										item.dDtFaturamentoItem + ' 03:00:00'
									);
									if (dDtFaturamentoItem < verifyDate) {
										item.dDtFaturamentoItem =
											moment(verifyDate).format(
												'YYYYMMDD'
											);
									} else {
										item.dDtFaturamentoItem =
											moment(dDtFaturamentoItem).format(
												'YYYYMMDD'
											);
									}

									const aItemPedidos: IAItemPedido = {
										...item
									};

									itemPedido.push(aItemPedidos);
								}

								OF.aItemPedido = itemPedido;

								if (OF.aPagamentos.length == 0) {
									let aPagto: IAPagamento = {
										cCodCTR: '',
										cPDV: '',
										cNSU: '',
										cNSUHost: '',
										cData: '',
										cHora: '',
										cCNPJ: '',
										nTaxa: 0,
										nValor: 0,
										nBandeira: 0
									};

									OF.aPagamentos = [aPagto];
								}

								let jsonSendOf: IGenerateOrders = {
									OF: [OF]
								};

								const sendOF: IGenerateSend = {
									jsonPost: JSON.parse(
										JSON.stringify(jsonSendOf)
									),
									tenantId:
										postGenerateOf.tenantId +
										',' +
										postGenerateOf.branchId
								};

								await this.broker.broadcast(
									'service-erp-protheus-generateSaveOrder',
									sendOF
								);

								loggerElastic(
									this.indexName,
									'200',
									this.originLayer,
									this.serviceName,
									JSON.stringify(OF)
								);
							}
						}
					}
				} else {
					logRetryMessage.executeDate = new Date(
						format(
							sub(new Date(), { minutes: 2 }),
							'yyyy-MM-dd HH:mm:ss.000'
						)
					);
					await logsController.postLogsRetrySystem(logRetryMessage);
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
		}
	}

	@Event({
		name: 'service-integration-getAwaitProcess',
		group: 'flow-cremmer-integration'
	})
	public async getAwaitProcess(ctx: any) {
		try {
			const logsController = new LogsRetrySystemController();

			const logRetryMessage: ILogsRetryIntegration = {
				lenght: 0,
				executeDate: new Date(),
				systemName: 'flow-crmIso-awaitProcess'
			};

			const getLastExecutation = await logsController.getLogsRetrySystem(
				logRetryMessage.systemName
			);

			if (getLastExecutation.length > 0) {
				const lastExecutation = getLastExecutation[0].executeDate;
				const difDate = differenceInMinutes(
					new Date(),
					lastExecutation
				);

				if (difDate >= 20) {
					await logsController.postLogsRetrySystem(logRetryMessage);

					const getOrdersInProcess =
						await SaveOrdersCrmIsoRepository.GetByAllStatus(
							StatusIntegrador.awaitProcess,
							format(lastExecutation, 'yyyy-MM-dd HH:mm:ss'),
							format(new Date(), 'yyyy-MM-dd HH:mm:ss')
						);

					if (getOrdersInProcess.length > 0) {
						for (const ordersInProcess of getOrdersInProcess) {
							const token: IGetToken = await getTokenUrlGlobal(
								process.env.PROTHEUSVIVEO_BASEURL +
									process.env.PROTHEUSVIVEO_RESTCREMER +
									process.env.PROTHEUSVIVEO_URLTOKEN +
									process.env.PROTHEUSVIVEO_USER +
									process.env.PROTHEUSVIVEO_PASS
							);

							if (token.access_token) {
								const urlProtheusOrder =
									process.env.PROTHEUSVIVEO_BASEURL +
									process.env.PROTHEUSVIVEO_RESTCREMER +
									process.env.PROTHEUSVIVEO_URLORDERV2;

								const getResponse =
									await await AxiosRequestType(
										urlProtheusOrder,
										'',
										'get',
										{
											Authorization: `Bearer ${token.access_token}`,
											TenantId: `${ordersInProcess.tenantId},${ordersInProcess.branchId}`
										},
										{ cNumCRM: ordersInProcess.orderId }
									);

								if (getResponse.status == 200) {
									let orderIdErp: string;
									if (
										typeof getResponse.message == 'string'
									) {
										orderIdErp = JSON.parse(
											await clearJson(
												getResponse.messageConsumer
											)
										).data.OF.cNumeroOF;
									} else {
										orderIdErp =
											getResponse.message.data.OF
												.cNumeroOF;
									}

									const updateIntegrador = {
										orderIdERP: orderIdErp,
										status: StatusIntegrador.generateOrder,
										tenantId: ordersInProcess.tenantId,
										orderId: ordersInProcess.orderId,
										updatedAt: new Date(),
										sourceCRM: 'ISOCRM'
									};
									await this.broker.broadcast(
										'service-integration-updatedStatus',
										updateIntegrador
									);
								} else {
									const updateIntegrador = {
										orderIdERP: '',
										status: StatusIntegrador.receivedOrigin,
										tenantId: ordersInProcess.tenantId,
										orderId: ordersInProcess.orderId,
										updateAt: new Date(),
										sourceCRM: 'ISOCRM'
									};
									await this.broker.broadcast(
										'service-integration-updatedStatus',
										updateIntegrador
									);
								}
							}
						}
					}
				}
			} else {
				logRetryMessage.executeDate = new Date(
					format(
						sub(new Date(), { minutes: 2 }),
						'yyyy-MM-dd HH:mm:ss.000'
					)
				);

				await logsController.postLogsRetrySystem(logRetryMessage);
			}
		} catch (error) {
			loggerElastic(
				this.indexName,
				'499',
				this.originLayer,
				this.serviceName,
				JSON.stringify(error.message)
			);
		}
	}

	@Event({
		name: 'service-integration-getRecordLocked',
		group: 'flow-cremmer-integration'
	})
	public async getRecordLocked(ctx: any) {
		try {
			const logsController = new LogsRetrySystemController();

			const logRetryMessage: ILogsRetryIntegration = {
				lenght: 0,
				executeDate: new Date(),
				systemName: 'flow-crmIso-getRecordLocked'
			};

			const getLastExecutation = await logsController.getLogsRetrySystem(
				logRetryMessage.systemName
			);

			if (getLastExecutation.length > 0) {
				const lastExecutation = getLastExecutation[0].executeDate;
				const difDate = differenceInMinutes(
					new Date(),
					lastExecutation
				);

				if (difDate >= 10) {
					await logsController.postLogsRetrySystem(logRetryMessage);

					const statusBusca = [
						StatusIntegrador.receivedOrigin,
						StatusIntegrador.consumerValid,
						StatusIntegrador.productValid
					];

					for (const status of statusBusca) {
						const getOrdersInProcess =
							await SaveOrdersCrmIsoRepository.GetByAllStatus(
								status,
								format(lastExecutation, 'yyyy-MM-dd HH:mm:ss'),
								format(new Date(), 'yyyy-MM-dd HH:mm:ss')
							);

						if (getOrdersInProcess.length > 0) {
							for (const ordersInProcess of getOrdersInProcess) {
								const updateIntegrador = {
									status: ordersInProcess.status,
									tenantId: ordersInProcess.tenantId,
									orderId: ordersInProcess.orderId,
									updatedAt: new Date(),
									sourceCRM: 'ISOCRM'
								};
								await this.broker.broadcast(
									'service-integration-updatedStatus',
									updateIntegrador
								);
							}
						}
					}
				}
			} else {
				logRetryMessage.executeDate = new Date(
					format(
						sub(new Date(), { minutes: 10 }),
						'yyyy-MM-dd HH:mm:ss.000'
					)
				);
				await logsController.postLogsRetrySystem(logRetryMessage);
			}
		} catch (error) {
			loggerElastic(
				this.indexName,
				'499',
				this.originLayer,
				this.serviceName,
				JSON.stringify(error.message)
			);
		}
	}

	@Event({
		name: 'service-integration-updatedStatus',
		group: 'flow-cremmer-integration'
	})
	public async UpdatedStatus(messageUpdate: ISaveOrders) {
		this.logger.info('=========INÍCIO UPDATE ORDERS=========');
		try {
			await SaveOrdersCrmIsoRepository.PutUpStatus(messageUpdate);
		} catch (error) {
			loggerElastic(
				this.indexName,
				'499',
				this.originLayer,
				this.serviceName,
				JSON.stringify(error.message)
			);
		}
	}

	@Event({
		name: 'service-integration-updateSetIso',
		group: 'flow-cremmer-integration'
	})
	public async UpdateSetIso(ctx: any) {
		try {
			this.paramsUp = ctx.params;

			await this.broker.broadcast(
				'service-crmiso-order-updateCrmIsoStatus',
				this.paramsUp
			);
		} catch (error) {
			loggerElastic(
				this.indexName,
				'499',
				this.originLayer,
				this.serviceName,
				JSON.stringify(error.message)
			);
		}
	}
}
