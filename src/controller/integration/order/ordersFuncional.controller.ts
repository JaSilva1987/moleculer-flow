import { Errors, ServiceBroker } from 'moleculer';
import {
	apmElasticConnect,
	loggerElastic
} from '../../../../services/library/elasticSearch';
import {
	RouteApiFuncional,
	StatusFuncional
} from '../../../enum/funcional/enum';
import { SystemasViveo } from '../../../enum/global/enum';
import {
	IGetOrdersFuncional,
	IOrdersMoneyFuncional,
	IReturnFuncionalOGProtheus,
	TreatmentControllerOrders
} from '../../../interface/funcional/order/ordersFuncional.interface';
import {
	INewStatus,
	IStatus
} from '../../../interface/funcional/order/statusFuncional.interface';
import { ISaveOrders } from '../../../interface/integration/order';
import { SaveOrdersFuncionalRepository } from '../../../repository/integration/order/ordersFuncional.repository';

export default class OrdersFuncionalBusinessRule {
	broker: ServiceBroker;
	isRequest: string;
	mountingResponse: object;
	mountingMResponse: object;
	mountingEResponse: object;
	paramFilter = 'Filter';
	indexName = 'flow-funcional-orders';
	isCode = '200';
	originLayer = 'controller';
	serviceNamePost = 'OrdersFuncionalService OrdersPost';
	serviceNameGet = 'OrdersFuncionalService OrdersGet';
	serviceNamePut = 'OrdersFuncionalService OrdersPut';
	serviceNameSchedule = 'OrdersFuncionalService Schedule';
	serviceNameCron = 'OrdersFuncionalService CronJob';

	public async validatesRoutes(requestApi: IOrdersMoneyFuncional) {
		try {
			for (let i = 0; i < requestApi.orders.length; i++) {
				const groupId = requestApi.orders[i].companyID;

				switch (groupId) {
					case '99':
						this.isRequest = RouteApiFuncional.numberNinetyNine;
						break;
					default:
						this.isRequest = RouteApiFuncional.numberOne;
						break;
				}

				const mountingRequest: ISaveOrders = {
					tenantId: String(requestApi.orders[i].companyID),
					orderId: String(requestApi.orders[i].preAuthorizationCode),
					sourceCRM: SystemasViveo.crmFuncional,
					createdAt: new Date(),
					updatedAt: new Date(),
					json_order: JSON.stringify(requestApi.orders[i]),
					branchId: String(requestApi.orders[i].branchID),
					orderIdERP: null,
					status: StatusFuncional.receivedOrigin
				};

				const checkOrder =
					await SaveOrdersFuncionalRepository.GetOrdersFuncional(
						mountingRequest.tenantId,
						mountingRequest.orderId,
						mountingRequest.sourceCRM,
						mountingRequest.branchId
					);

				if (checkOrder == undefined || checkOrder == null) {
					await SaveOrdersFuncionalRepository.PostOrdersFuncional(
						mountingRequest
					);
				} else {
					await SaveOrdersFuncionalRepository.PutOrdersFuncional(
						mountingRequest
					);
				}
			}

			loggerElastic(
				this.indexName,
				this.isCode,
				this.originLayer,
				this.serviceNamePost,
				JSON.stringify(requestApi),
				JSON.stringify(this.isRequest)
			);

			return this.isRequest;
		} catch (error) {
			loggerElastic(
				this.indexName,
				error.code,
				this.originLayer,
				this.serviceNamePost,
				JSON.stringify(requestApi),
				JSON.stringify(error.message)
			);
			apmElasticConnect.captureError(new Error(error.message));
			throw new Errors.MoleculerError(error.message, error.code);
		}
	}

	public async validateGet(requestApi: IGetOrdersFuncional) {
		const groupId = requestApi.groupId;

		switch (groupId) {
			case '99':
				this.isRequest = RouteApiFuncional.numberNinetyNine;
				break;
			default:
				this.isRequest = RouteApiFuncional.numberOne;
				break;
		}
		return this.isRequest;
	}

	public async jsonGetParams(jsonApi: IGetOrdersFuncional) {
		const isPage =
			jsonApi.pageNumber != undefined ? jsonApi.pageNumber : '0';
		const isSize = jsonApi.pageSize != undefined ? jsonApi.pageSize : '0';
		const jsonTotvs: IStatus = {
			companyID: jsonApi.groupId,
			pageNumber: isPage,
			pageSize: isSize,
			cronJob: false,
			methodSend: 'get',
			preAuthorizationCode: jsonApi.preAuthorizationCode,
			internalOrder: jsonApi.internalOrder,
			salesERPOrder: jsonApi.salesERPOrder,
			isRange: jsonApi.isRange,
			salesInternal: jsonApi.salesInternal,
			dateTimeUpdate: jsonApi.dateTimeUpdate
		};

		const businessRule: INewStatus = {
			cronJob: jsonTotvs.cronJob,
			methodSend: jsonTotvs.methodSend,
			urlObj: {}
		};

		if (Number(jsonTotvs.pageNumber) > 0) {
			Object.assign(businessRule.urlObj, {
				Page: jsonTotvs.pageNumber,
				PageSize: jsonTotvs.pageSize
			});
		}
		if (jsonTotvs.preAuthorizationCode != undefined) {
			Object.assign(businessRule.urlObj, {
				[this
					.paramFilter]: `preAuthorizationCode=${jsonTotvs.preAuthorizationCode}`
			});
		}

		if (jsonTotvs.salesERPOrder != undefined) {
			Object.assign(businessRule.urlObj, {
				Order: jsonTotvs.salesERPOrder
			});
		}
		if (jsonTotvs.salesInternal != undefined) {
			Object.assign(businessRule.urlObj, {
				Fields: `preAuthorizationCode=${jsonTotvs.preAuthorizationCode}`
			});
		}

		if (jsonTotvs.dateTimeUpdate != undefined) {
			Object.assign(businessRule.urlObj, {
				[this
					.paramFilter]: `dateTimeUpdate gt '${jsonTotvs.dateTimeUpdate}'`
			});
		}

		const isInternalOrder =
			jsonTotvs.internalOrder != undefined
				? jsonTotvs.internalOrder.includes('[')
				: false;

		if (isInternalOrder == true) {
			jsonTotvs.internalOrder != undefined
				? Object.assign(businessRule.urlObj, {
						[this
							.paramFilter]: `internalOrder=${jsonTotvs.internalOrder}`
				  })
				: '';
		} else {
			jsonTotvs.internalOrder != undefined
				? Object.assign(businessRule.urlObj, {
						internalOrder: `'${jsonTotvs.internalOrder}'`
				  })
				: '';
		}

		if (jsonTotvs.isRange != undefined) {
			const arrayRange = jsonTotvs.isRange.split(',');
			Object.assign(businessRule.urlObj, {
				[this
					.paramFilter]: `internalOrder eq '${jsonTotvs.isRange.slice(
					0,
					jsonTotvs.isRange.indexOf(',')
				)}' Or internalOrder eq '${arrayRange.at(-1)}'`
			});
		}

		return businessRule;
	}

	public async treatementResponseMafra(responseApi: Array<object>) {
		try {
			responseApi.forEach(
				(mafraT: { responseTotvs: object; isValid: boolean }) => {
					const subObject: TreatmentControllerOrders = Object(
						mafraT.responseTotvs
					);
					if (mafraT.isValid == true) {
						const searchMessage = Object(subObject.message);

						const entriesMessage: IReturnFuncionalOGProtheus = {
							total: searchMessage.total,
							hasNext: searchMessage.hasNext,
							orders: searchMessage.data.orders
						};

						this.mountingResponse = {
							viveo: {
								mafra: entriesMessage
							}
						};
					} else {
						this.mountingResponse = {
							viveo: {
								mafra: subObject
							}
						};
					}
				}
			);

			loggerElastic(
				this.indexName,
				this.isCode,
				this.originLayer,
				this.serviceNamePost,
				JSON.stringify(responseApi),
				JSON.stringify(this.isRequest)
			);
			return this.mountingResponse;
		} catch (error) {
			loggerElastic(
				this.indexName,
				error.code,
				this.originLayer,
				this.serviceNamePost,
				JSON.stringify(responseApi),
				JSON.stringify(error.message)
			);
			apmElasticConnect.captureError(new Error(error.message));
			throw new Errors.MoleculerError(error.message, error.code);
		}
	}

	public async treatementResponseExpressa(responseApi: Array<object>) {
		try {
			responseApi.forEach(
				(expressaT: { responseTotvs: object; isValid: boolean }) => {
					const subObject: TreatmentControllerOrders = Object(
						expressaT.responseTotvs
					);
					if (expressaT.isValid == true) {
						const searchMessage = Object(subObject.message);

						const entriesMessage: IReturnFuncionalOGProtheus = {
							total: searchMessage.total,
							hasNext: searchMessage.hasNext,
							orders: searchMessage.data.orders
						};

						this.mountingResponse = {
							viveo: {
								expressa: entriesMessage
							}
						};
					} else {
						this.mountingResponse = {
							viveo: {
								expressa: subObject
							}
						};
					}
				}
			);

			loggerElastic(
				this.indexName,
				this.isCode,
				this.originLayer,
				this.serviceNamePost,
				JSON.stringify(responseApi),
				JSON.stringify(this.isRequest)
			);
			return this.mountingResponse;
		} catch (error) {
			loggerElastic(
				this.indexName,
				error.code,
				this.originLayer,
				this.serviceNamePost,
				JSON.stringify(responseApi),
				JSON.stringify(error.message)
			);
			apmElasticConnect.captureError(new Error(error.message));
			throw new Errors.MoleculerError(error.message, error.code);
		}
	}
}
