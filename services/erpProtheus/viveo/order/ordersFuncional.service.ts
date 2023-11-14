import {
	Errors,
	ServiceBroker,
	ServiceSchema,
	Service as MoleculerService
} from 'moleculer';

import { Event, Service } from 'moleculer-decorators';
import { IGetToken } from '../../../../src/interface/erpProtheus/global';
import {
	IOrdersProtheus,
	TreatmentOrdersProtheus
} from '../../../../src/interface/funcional/order/ordersFuncional.interface';
import { INewStatus } from '../../../../src/interface/funcional/order/statusFuncional.interface';
import {
	ordersFuncionalResponseViveoSchemaType,
	ordersFuncionalResponseViveoSchema
} from '../../../../src/validator/erpProtheus/viveo/ordersFuncional.validator';
import { validatorFactory } from '../../../../src/validator/validator';
import { AxiosRequestComplete, AxiosRequestType } from '../../../library/axios';
import {
	loggerElastic,
	apmElasticConnect
} from '../../../library/elasticSearch';
import { TreatmentFuncional } from '../../../../src/enum/funcional/enum';
import { SystemasViveo } from '../../../../src/enum/global/enum';
import { StatusIntegrador } from '../../../../src/enum/integration/enum';
import { getTokenGlobal } from '../../../library/erpProtheus';

@Service({
	name: 'service.erpprotheusviveo.orders',
	group: 'flow-funcional'
})
export default class OrdersPostFuncionalService extends MoleculerService {
	responseRequest: any | object;
	filterPage: string;
	objFilter: any | object;
	responseProtheus: any | object;
	indexName = 'flow-funcional-orders';
	isCode = '200';
	originLayer = 'erpprotheusexpressa';
	serviceNamePost = 'OrdersFuncionalService OrdersPost';
	serviceNameGet = 'OrdersFuncionalService OrdersGet';
	serviceNamePut = 'OrdersFuncionalService OrdersPut';
	serviceNameSchedule = 'OrdersFuncionalService Schedule';
	serviceNameCron = 'OrdersFuncionalService CronJob';

	public constructor(public broker: ServiceBroker, schema: ServiceSchema) {
		super(broker);
	}

	@Event({
		name: 'funcional.erpprotheusviveo.post.orders',
		group: 'flow-funcional'
	})
	public async OrdersMethod(ctxMessage: IOrdersProtheus) {
		try {
			const token: IGetToken = await getTokenGlobal(
				process.env.PROTHEUSVIVEO_BASEURLFUNCIONAL_VIVEO,
				process.env.PROTHEUSVIVEO_RESTFUNCIONAL,
				process.env.PROTHEUSVIVEO_URLTOKEN,
				process.env.PROTHEUSVIVEO_USER,
				process.env.PROTHEUSVIVEO_PASS
			);

			const urlProtheusOrders =
				process.env.PROTHEUSVIVEO_BASEURLFUNCIONAL_VIVEO +
				process.env.PROTHEUSVIVEO_RESTFUNCIONAL +
				process.env.PROTHEUSVIVEO_FUNCIONAL_REQUEST +
				'orders/';

			const tenantFilial =
				ctxMessage.codeCompany + ',' + ctxMessage.codeSubsidiary;

			this.responseRequest = await AxiosRequestComplete(
				urlProtheusOrders,
				ctxMessage.jsonEnv,
				'Authorization',
				'Bearer ' + token.access_token,
				ctxMessage.methodSend,
				'TenantID',
				tenantFilial,
				''
			);

			loggerElastic(
				this.indexName,
				this.responseRequest.status,
				this.originLayer,
				this.serviceNamePost,
				JSON.stringify(ctxMessage),
				JSON.stringify(this.responseRequest)
			);

			this.objFilter = JSON.parse(ctxMessage.jsonEnv);

			if (
				this.responseRequest.status == 200 ||
				this.responseRequest.status == 201
			) {
				const objReturn = this.responseRequest.message;
				const orderValidation =
					validatorFactory<ordersFuncionalResponseViveoSchemaType>(
						ordersFuncionalResponseViveoSchema
					);
				const bodyRecived =
					objReturn as ordersFuncionalResponseViveoSchemaType;
				const validateJson = orderValidation.verify(bodyRecived);

				if (validateJson !== undefined) {
					for (let c = 0; c < objReturn.details.length; c++) {
						const objRecord = {
							tenantId: objReturn.details[c].groupCompanyID,
							orderId: objReturn.details[c].preAuthorizationCode,
							sourceCRM: SystemasViveo.crmFuncional,
							branchId: objReturn.details[c].branchID,
							orderIdERP: objReturn.details[c].orderNumber,
							status: StatusIntegrador.integrateProtheus
						};

						await this.broker.broadcast(
							'service.integration.updateReturnProtheus',
							objRecord
						);

						loggerElastic(
							this.indexName,
							this.isCode,
							this.originLayer,
							this.serviceNamePost,
							JSON.stringify(objReturn),
							JSON.stringify(objRecord)
						);
					}
				} else {
					for (let c = 0; c < objReturn.details.length; c++) {
						const objRecord = {
							tenantId: objReturn.details[c].companyID,
							orderId: objReturn.details[c].preAuthorizationCode,
							sourceCRM: SystemasViveo.crmFuncional,
							branchId: objReturn.details[c].branchID,
							orderIdERP:
								objReturn.details[c].numberDeliveryOrder,
							status: StatusIntegrador.returnInvalid
						};

						await this.broker.broadcast(
							'service.integration.updateReturnProtheus',
							objRecord
						);

						loggerElastic(
							this.indexName,
							this.isCode,
							this.originLayer,
							this.serviceNamePost,
							JSON.stringify(objReturn),
							JSON.stringify(objRecord)
						);
					}
				}
			} else if (this.responseRequest.status === 503) {
				const objRecord = {
					tenantId: this.objFilter.companyID,
					orderId: this.objFilter.preAuthorizationCode,
					sourceCRM: SystemasViveo.crmFuncional,
					branchId: this.objFilter.branchID,
					status: StatusIntegrador.retryProtheus
				};

				await this.broker.broadcast(
					'service.integration.updateReturnProtheus',
					objRecord
				);

				loggerElastic(
					this.indexName,
					this.isCode,
					this.originLayer,
					this.serviceNamePost,
					this.responseRequest.status,
					JSON.stringify(objRecord)
				);
			} else {
				const objRecord = {
					tenantId: this.objFilter.companyID,
					orderId: this.objFilter.preAuthorizationCode,
					sourceCRM: SystemasViveo.crmFuncional,
					branchId: this.objFilter.branchID,
					status: StatusIntegrador.errorProtheus
				};

				await this.broker.broadcast(
					'service.integration.updateReturnProtheus',
					objRecord
				);

				loggerElastic(
					this.indexName,
					this.isCode,
					this.originLayer,
					this.serviceNamePost,
					JSON.stringify(ctxMessage),
					JSON.stringify(objRecord)
				);
			}
		} catch (error) {
			loggerElastic(
				this.indexName,
				error.code,
				this.originLayer,
				this.serviceNamePost,
				JSON.stringify(ctxMessage),
				JSON.stringify(error.message)
			);
			apmElasticConnect.captureError(new Error(error.message));
			throw new Errors.MoleculerError(error.message, error.code);
		}
	}

	@Event({
		name: 'funcional.erpprotheusmafra.get.orders',
		group: 'flow-funcional'
	})
	public async OrdersGet(ctxMessage: INewStatus) {
		try {
			const token: IGetToken = await getTokenGlobal(
				process.env.PROTHEUSVIVEO_BASEURLFUNCIONAL_VIVEO,
				process.env.PROTHEUSVIVEO_RESTFUNCIONAL,
				process.env.PROTHEUSVIVEO_URLTOKEN,
				process.env.PROTHEUSVIVEO_USER,
				process.env.PROTHEUSVIVEO_PASS
			);

			const urlProtheusOrders =
				process.env.PROTHEUSVIVEO_BASEURLFUNCIONAL_VIVEO +
				process.env.PROTHEUSVIVEO_RESTFUNCIONAL +
				process.env.PROTHEUSVIVEO_FUNCIONAL_REQUEST +
				'orders/';

			this.responseProtheus = await AxiosRequestType(
				urlProtheusOrders,
				'',
				'get',
				{ ['Authorization']: 'Bearer ' + token.access_token },
				ctxMessage.urlObj
			);

			loggerElastic(
				this.indexName,
				this.responseProtheus.status,
				this.originLayer,
				this.serviceNameGet,
				JSON.stringify(ctxMessage),
				JSON.stringify(this.responseProtheus)
			);

			if (
				this.responseProtheus.status == 200 ||
				this.responseProtheus.status == 201
			) {
				if (ctxMessage.cronJob === true) {
					await this.broker.broadcast(
						'service.integration.scheduleEnv',
						this.responseProtheus
					);

					loggerElastic(
						this.indexName,
						this.responseProtheus.status,
						this.originLayer,
						this.serviceNameSchedule,
						JSON.stringify(ctxMessage),
						JSON.stringify(this.responseProtheus)
					);
				} else {
					const objProtheus: TreatmentOrdersProtheus = {
						responseTotvs: this.responseProtheus,
						isValid: true
					};

					loggerElastic(
						this.indexName,
						this.responseProtheus.status,
						this.originLayer,
						this.serviceNameGet,
						JSON.stringify(ctxMessage),
						JSON.stringify(objProtheus)
					);

					return objProtheus;
				}
			} else {
				const objProtheus: TreatmentOrdersProtheus = {
					responseTotvs: this.responseProtheus,
					isValid: false
				};

				loggerElastic(
					this.indexName,
					this.responseProtheus.status,
					this.originLayer,
					this.serviceNameGet,
					JSON.stringify(ctxMessage),
					JSON.stringify(objProtheus)
				);

				return objProtheus;
			}
		} catch (error) {
			if (ctxMessage.cronJob != true) {
				const objProtheus: TreatmentOrdersProtheus = {
					responseTotvs: {
						code: error.code,
						message: TreatmentFuncional.not_access
					},
					isValid: false
				};

				loggerElastic(
					this.indexName,
					error.code,
					this.originLayer,
					this.serviceNameGet,
					JSON.stringify(ctxMessage),
					JSON.stringify(error.message)
				);
				apmElasticConnect.captureError(new Error(error.message));

				return objProtheus;
			}
			loggerElastic(
				this.indexName,
				error.code,
				this.originLayer,
				this.serviceNameGet,
				JSON.stringify(ctxMessage),
				JSON.stringify(error.message)
			);
			apmElasticConnect.captureError(new Error(error.message));
		}
	}
}
