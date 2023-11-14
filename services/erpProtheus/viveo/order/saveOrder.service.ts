import {
	Service as MoleculerService,
	ServiceBroker,
	ServiceSchema
} from 'moleculer';
import { Event, Service } from 'moleculer-decorators';
import { clearJson, getTokenUrlGlobal } from '../../../library/erpProtheus';
import { IGetToken } from '../../../../src/interface/erpProtheus/global';
import { AxiosRequestType } from '../../../library/axios';
import {
	apmElasticConnect,
	loggerElastic
} from '../../../library/elasticSearch';
import { StatusIso } from '../../../../src/enum/crmIso/enum';
import { StatusIntegrador } from '../../../../src/enum/integration/enum';
import {
	IGenerateSend,
	IOrderCheck,
	ISaveOrders
} from '../../../../src/interface/integration/order';
import { EcommerceOrderRequestIntegrationRepository } from '../../../../src/repository/integration/order/orderEcommerce.repository';
import { statusEcommerceIntegration } from '../../../../src/enum/integration/statusEcommerceProducts.enum';
import { IConfigLogCrmIso } from '../../../../src/interface/crmIso/config/configLog.interface';
import { ConfigLogRepository } from '../../../../src/repository/crmIso/config/configLog.repository';

@Service({
	name: 'service-crmiso-order-saveOrder',
	group: 'flow-cremmer'
})
export default class SaveOrder extends MoleculerService {
	public indexName = 'flow-integration-routeorders';
	public serviceName = 'erpProtheus.order.service';
	public originLayer = 'integration';

	public constructor(public broker: ServiceBroker, schema: ServiceSchema) {
		super(broker);
	}

	@Event({
		name: 'service-erp-protheus-generateSaveOrder',
		group: 'flow-cremmer-protheus'
	})
	public async GenerateSaveOrder(message: IGenerateSend) {
		try {
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

				const getResponse = await await AxiosRequestType(
					urlProtheusOrder,
					'',
					'get',
					{
						Authorization: `Bearer ${token.access_token}`,
						TenantId: message.tenantId
					},
					{ cNumCRM: message.jsonPost.OF[0].cNumCRM }
				);

				// Atualiza LOG Integrador
				let updateIntegrador: ISaveOrders = {
					status: StatusIntegrador.generateOrder,
					tenantId: message.jsonPost.OF[0].cEmpresa,
					orderId: message.jsonPost.OF[0].cNumCRM,
					sourceCRM: 'ISOCRM'
				};

				// Atualiza ISO
				let updateIso = {
					cEmpresa: message.jsonPost.OF[0].cEmpresa,
					cNumCRM: message.jsonPost.OF[0].cNumCRM,
					enumStatusIso: StatusIso.thirty_seven
				};

				let resultGet;
				if (typeof getResponse.message == 'string') {
					resultGet = JSON.parse(
						getResponse.message.replace(/\n/g, '')
					);
				} else {
					resultGet = getResponse.message;
				}

				if (
					getResponse.status !== 200 ||
					resultGet.data?.OF?.cStatus === '4'
				) {
					this.logger.trace(
						`LOG GET VERIFICA TENANTID ${message.tenantId} E NUMCRM ${message.jsonPost.OF[0].cNumCRM}`
					);

					apmElasticConnect.startTransaction(
						'IcrmIso V1 => Protheus - POST Order',
						'request'
					);
					const response = await await AxiosRequestType(
						urlProtheusOrder,
						message.jsonPost,
						'post',
						{
							Authorization: `Bearer ${token.access_token}`,
							TenantId: message.tenantId
						}
					);
					apmElasticConnect.endTransaction(response);

					//Gera LOG na OrderChecks
					let valueOrderCheck: IOrderCheck = {
						tenantId: '11',
						orderId: message.jsonPost.OF[0].cNumCRM,
						sourceCRM: 'ISOCRM',
						checkDescription: 'gerar_of',
						seq: 3,
						topicName: this.serviceName,
						createdAt: new Date(),
						updatedAt: new Date(),
						sent: '1',
						success: '0',
						retryNumber: 0,
						nextTry: new Date(),
						commandSent: JSON.stringify(message.jsonPost),
						url: urlProtheusOrder,
						method: 'POST',
						body: JSON.stringify(message.jsonPost, null, 2),
						responseCode: 400,
						response: '',
						validations_ok: 0
					};

					//Log enviado ao iso
					let logIso: IConfigLogCrmIso = {
						orderId: message.jsonPost.OF[0].cNumCRM,
						name: StatusIntegrador.generateOrder,
						status: 'OK',
						description: '',
						dateTimeSav: new Date(),
						dateTimeEvt: new Date(),
						branchId: null,
						orderIdERP: null,
						errorType: null,
						userViewer: null
					};

					if (response.status == 201) {
						valueOrderCheck.success = '1';
						valueOrderCheck.validations_ok = 1;
						valueOrderCheck.responseCode = response.status;
						valueOrderCheck.response = JSON.stringify(
							response.message
						);

						this.broker.broadcast(
							'service.integration.SaveOrderCheck',
							valueOrderCheck
						);

						const getOf =
							response?.message?.details[0]?.numberOF || 0;

						updateIntegrador.orderIdERP = getOf;

						await this.broker.broadcast(
							'service-integration-updatedStatus',
							updateIntegrador
						);

						await this.broker.broadcast(
							'service-integration-updateSetIso',
							updateIso
						);

						logIso.description =
							'Atualização status: ' +
							StatusIso.thirty_seven +
							' Ordem gerada ID: ' +
							getOf +
							' - ' +
							message.tenantId;

						await this.broker.broadcast(
							'service.crmIso.saveLogCrmIso',
							logIso
						);

						loggerElastic(
							this.indexName,
							'200',
							this.originLayer,
							this.serviceName,
							`post - ${urlProtheusOrder}`,
							JSON.stringify(response.message)
						);
					} else if (
						response.status == 429 ||
						response.message.code == '429'
					) {
						valueOrderCheck.success = '1';
						valueOrderCheck.validations_ok = 1;
						valueOrderCheck.responseCode = response.status;
						valueOrderCheck.response = JSON.stringify(
							response.message
						);

						this.broker.broadcast(
							'service.integration.SaveOrderCheck',
							valueOrderCheck
						);

						const getOf =
							response?.message?.details[0]?.numberOF || 0;

						updateIntegrador.orderIdERP = getOf;

						await this.broker.broadcast(
							'service-integration-updatedStatus',
							updateIntegrador
						);

						await this.broker.broadcast(
							'service-integration-updateSetIso',
							updateIso
						);

						logIso.description =
							'Atualização status: ' +
							StatusIso.thirty_seven +
							' Ordem gerada ID: ' +
							getOf +
							' - ' +
							message.tenantId;

						await this.broker.broadcast(
							'service.crmIso.saveLogCrmIso',
							logIso
						);

						loggerElastic(
							this.indexName,
							'429',
							this.originLayer,
							this.serviceName,
							`post - ${urlProtheusOrder}`,
							JSON.stringify(response.message)
						);
					} else if (
						response.status == 409 ||
						response.message.code == '409'
					) {
						const msgRetorno: any = response.message;
						const OFIso: string = msgRetorno.detailedMessage.substr(
							msgRetorno.detailedMessage.indexOf(
								'Já existe OF vinculada'
							),
							msgRetorno.detailedMessage.indexOf(
								'Já existe OF vinculada'
							) -
								msgRetorno.detailedMessage.indexOf(
									'| Mensagem '
								) +
								20
						);

						const isGet = await ConfigLogRepository.GetLog(logIso);

						if (isGet == undefined || isGet == null) {
							(updateIntegrador.status =
								StatusIntegrador.errorProtheus + ' OF'),
								await this.broker.broadcast(
									'service-integration-updatedStatus',
									updateIntegrador
								);
							updateIso.enumStatusIso = StatusIso.seventeen;

							await this.broker.broadcast(
								'service-integration-updateSetIso',
								updateIso
							);

							logIso.status = 'FALHA';
							logIso.description =
								'Atualização status: ' +
								StatusIso.seventeen +
								' ' +
								OFIso +
								' ' +
								' - ' +
								msgRetorno.detailedMessage;

							await this.broker.broadcast(
								'service.crmIso.saveLogCrmIso',
								logIso
							);
						} else {
							this.logger.info(
								`ORDER DUPLICADA:  ${logIso.orderId}`
							);
						}

						loggerElastic(
							this.indexName,
							'409',
							this.originLayer,
							this.serviceName,
							`post - ${urlProtheusOrder}`,
							JSON.stringify(response.message)
						);
					} else {
						valueOrderCheck.success = '0';
						valueOrderCheck.validations_ok = 0;
						valueOrderCheck.responseCode = response.status;
						valueOrderCheck.response = JSON.stringify(
							response.message
						);

						this.broker.broadcast(
							'service.integration.SaveOrderCheck',
							valueOrderCheck
						);

						// atualização logIso
						logIso.status = 'FALHA';
						logIso.description =
							'Atualização status: ' +
							StatusIso.seventeen +
							' - ' +
							JSON.stringify(response.message);

						await this.broker.broadcast(
							'service.crmIso.saveLogCrmIso',
							logIso
						);

						// atualização status integrador
						updateIntegrador.status =
							StatusIntegrador.errorProtheus + ' OF';

						await this.broker.broadcast(
							'service-integration-updatedStatus',
							updateIntegrador
						);

						const updateIsoGenericErrorOf = {
							cEmpresa: message.jsonPost.OF[0].cEmpresa,
							cNumCRM: message.jsonPost.OF[0].cNumCRM,
							enumStatusIso: StatusIso.seventeen
						};

						await this.broker.broadcast(
							'service-integration-updateSetIso',
							updateIsoGenericErrorOf
						);

						loggerElastic(
							this.indexName,
							'400',
							this.originLayer,
							this.serviceName,
							`post - ${urlProtheusOrder}`,
							JSON.stringify(response.message)
						);
					}
				} else {
					updateIntegrador.orderIdERP =
						getResponse.message.data.OF.cNumeroOF;

					await this.broker.broadcast(
						'service-integration-updatedStatus',
						updateIntegrador
					);

					await this.broker.broadcast(
						'service-integration-updateSetIso',
						updateIso
					);
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
			this.logger.error(error.message, 499);
		}
	}

	@Event({
		name: 'service-erp-protheus-generateSaveOrderEcommerce',
		group: 'flow-cremmer-protheus'
	})
	public async GenerateSaveOrderEcommerce(message: IGenerateSend) {
		this.indexName = 'flow-ecommerce-orderrequest';

		try {
			apmElasticConnect.startTransaction(this.indexName, 'string');

			const token: IGetToken = await getTokenUrlGlobal(
				process.env.PROTHEUSVIVEO_BASEURL_BELLACOTTON +
					'11' +
					process.env.PROTHEUSVIVEO_URLTOKEN +
					process.env.PROTHEUSVIVEO_USER +
					process.env.PROTHEUSVIVEO_PASS
			);

			if (token.access_token) {
				const urlProtheusOrder =
					process.env.PROTHEUSVIVEO_BASEURL_BELLACOTTON +
					process.env.PROTHEUSVIVEO_RESTCREMER +
					process.env.PROTHEUSVIVEO_URLORDERV2;

				const responseOrder = await AxiosRequestType(
					urlProtheusOrder,
					message.jsonPost,
					'post',
					{
						TenantId: message.tenantId,
						Authorization: `Bearer ${token.access_token}`
					}
				);

				const repository = EcommerceOrderRequestIntegrationRepository;

				const existOrder =
					await repository.GetEcommerceOrderRequestIntegration(
						message.dataOrder.idOrder
					);

				if (responseOrder.status == 201) {
					message.dataOrder.status =
						statusEcommerceIntegration.success;

					message.dataOrder.JSONRetorno =
						JSON.stringify(responseOrder);
				} else {
					message.dataOrder.status = statusEcommerceIntegration.erro;
					const returnOF: string =
						responseOrder.message.detailedMessage.substr(
							responseOrder.message.detailedMessage.indexOf(
								'Já existe OF vinculada'
							),
							responseOrder.message.detailedMessage.indexOf(
								'Já existe OF vinculada'
							) -
								responseOrder.message.detailedMessage.indexOf(
									'| Mensagem '
								) +
								18
						);

					if (returnOF.indexOf(message.dataOrder.idOrder) > 0) {
						message.dataOrder.status =
							statusEcommerceIntegration.success;
						message.dataOrder.JSONRetorno = returnOF;
					} else {
						message.dataOrder.status =
							statusEcommerceIntegration.erro;
						message.dataOrder.JSONRetorno =
							JSON.stringify(responseOrder);
					}
				}

				if (existOrder.length > 0) {
					await repository.PutEcommerceOrderRequestIntegration(
						message.dataOrder,
						existOrder[0].id
					);
				}

				apmElasticConnect.endTransaction([this.returnResponse]);

				loggerElastic(
					this.indexName,
					responseOrder.status.toString(),
					this.originLayer,
					this.serviceName,
					JSON.stringify(message),
					JSON.stringify(responseOrder)
				);
			}
		} catch (error) {
			loggerElastic(
				this.indexName,
				error.code.toString(),
				this.originLayer,
				this.serviceName,
				JSON.stringify(message),
				JSON.stringify(error.message)
			);
			apmElasticConnect
				.setTransactionName(this.indexName)
				.captureError(new Error(error.message))
				.endTransaction();
			this.logger.error(error.message, error.code);
		}
	}
}
