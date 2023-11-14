'use strict';
import * as dotenv from 'dotenv';
import {
	Service as MoleculerService,
	ServiceBroker,
	ServiceSchema
} from 'moleculer';
import { Event, Service } from 'moleculer-decorators';
import { StatusIso } from '../../../../src/enum/crmIso/enum';
import { StatusIntegrador } from '../../../../src/enum/integration/enum';
import { IConfigLogCrmIso } from '../../../../src/interface/crmIso/config/configLog.interface';
import { IGetToken } from '../../../../src/interface/erpProtheus/global';
import {
	IGetProductUnitProduct,
	IGetUnitProduct,
	IUnitProduct
} from '../../../../src/interface/erpProtheus/product/unitProduct.interface';
import {
	IOrderCheck,
	ISaveOrders
} from '../../../../src/interface/integration/order';
import { IMessageValidateUnitProduct } from '../../../../src/interface/integration/product/messageUnitProduct.interface';
import { AxiosRequestComplete, AxiosRequestType } from '../../../library/axios';
import { loggerElastic } from '../../../library/elasticSearch';
import { clearJson, getTokenUrlGlobal } from '../../../library/erpProtheus';

dotenv.config();
@Service({
	name: 'consApiUnitProduct',
	group: 'cremer'
})
export default class consApiUnitProductErpProtheusViveo extends MoleculerService {
	public constructor(public broker: ServiceBroker, schema: ServiceSchema) {
		super(broker);
	}

	public indexName = 'flow-crmiso-routeorders';
	public serviceName = 'consApiUnitProduct.service';
	public originLayer = 'erpprotheusviveo';

	public async started() {}
	@Event({
		name: 'service.erpProtheusViveo.getUnitProduct',
		group: 'cremer'
	})
	public async GetUnitProduct(message: IGetUnitProduct) {
		try {
			this.logger.info('==============GET UNIT PRODUCT==============');

			const token: IGetToken = await getTokenUrlGlobal(
				process.env.PROTHEUSVIVEO_BASEURL +
					process.env.PROTHEUSVIVEO_RESTCREMER +
					process.env.PROTHEUSVIVEO_URLTOKEN +
					process.env.PROTHEUSVIVEO_USER +
					process.env.PROTHEUSVIVEO_PASS
			);

			if (token.access_token) {
				const products: IGetUnitProduct = {
					Produtos: []
				};

				for (const product of message.Produtos) {
					let unitProduct: IGetProductUnitProduct = {
						Produto: product.Produto,
						UMOrigem: product.UMOrigem,
						UMDestino:
							product.UMDestino == ''
								? product.UMOrigem
								: product.UMDestino,
						FatorConversao: product.FatorConversao
					};

					products.Produtos.push(unitProduct);
				}

				const urlProtheusProduct =
					process.env.PROTHEUSVIVEO_BASEURL +
					process.env.PROTHEUSVIVEO_RESTCREMER +
					process.env.PROTHEUSVIVEO_UNITPRODUCT;

				let numTentResponseProduct: number = 1;

				let responseProduct = await AxiosRequestComplete(
					urlProtheusProduct,
					products,
					'Authorization',
					'Bearer ' + token.access_token,
					'get',
					'tenantId',
					message.TenantId,
					'unitMeasure'
				);

				while (
					responseProduct.status != 200 &&
					numTentResponseProduct < 4
				) {
					numTentResponseProduct++;

					responseProduct = await AxiosRequestComplete(
						urlProtheusProduct,
						products,
						'Authorization',
						'Bearer ' + token.access_token,
						'get',
						'tenantId',
						message.TenantId,
						'unitMeasure'
					);
				}

				// Prepara valor order check
				const valueOrderCheck: IOrderCheck = {
					tenantId: '11',
					orderId: message.orderId,
					sourceCRM: 'ISOCRM',
					checkDescription: 'unidade_medida',
					seq: 2,
					topicName: this.serviceName,
					createdAt: new Date(),
					updatedAt: new Date(),
					sent: '1',
					success: '1',
					retryNumber: 0,
					nextTry: new Date(),
					commandSent: JSON.stringify(responseProduct.message),
					url: urlProtheusProduct,
					method: 'GET',
					body: JSON.stringify(products, null, 2),
					responseCode: responseProduct.status,
					response: JSON.stringify(responseProduct.message),
					validations_ok: 1
				};

				const messageOrders: ISaveOrders = {
					tenantId: '11',
					orderId: message.orderId,
					sourceCRM: 'ISOCRM',
					status: StatusIntegrador.productValid,
					createdAt: new Date(),
					updatedAt: new Date()
				};

				try {
					responseProduct.status =
						String(responseProduct.message).includes(
							'AxiosError'
						) ||
						String(responseProduct.message).includes(
							'ECONNREFUSED'
						) ||
						String(responseProduct.message).includes('ECONNRESET')
							? 500
							: responseProduct.status;

					if (responseProduct.status == 200) {
						const response: IUnitProduct = await clearJson(
							responseProduct.message
						);

						let msgUnitProduct: IMessageValidateUnitProduct;

						if (response.OF) {
							valueOrderCheck.validations_ok =
								response.OF.status == 'SUCESSO' ? 1 : 0;

							///mock
							response.OF.dtFaturamento = message.DTFaturamento;

							msgUnitProduct = {
								message: response,
								valueOrderCheck: valueOrderCheck
							};
						} else {
							response.OF = {
								situacaoFinal: '',
								dtFaturamento: '',
								status: '',
								mensagemFinal: '',
								items: []
							};

							msgUnitProduct = {
								message: response,
								valueOrderCheck: valueOrderCheck
							};
						}

						this.broker.broadcast(
							'service.integration.product.consValidateUnitProduct',
							msgUnitProduct
						);

						loggerElastic(
							this.indexName,
							'200',
							this.originLayer,
							this.serviceName,
							`get - ${urlProtheusProduct}`,
							JSON.stringify(responseProduct)
						);
					} else if (responseProduct.status >= 500) {
						messageOrders.status = StatusIntegrador.consumerValid;
					} else {
						valueOrderCheck.responseCode = responseProduct.status;
						valueOrderCheck.response =
							'Erro ao enviar dados do Produto';
						valueOrderCheck.validations_ok = 0;

						messageOrders.status =
							StatusIntegrador.errorProtheus + ' Produto';

						const logIso: IConfigLogCrmIso = {
							orderId: message.orderId,
							name: StatusIntegrador.errorProtheus + ' Produto',
							status: 'FALHA',
							description: JSON.stringify(
								responseProduct.message
							),
							dateTimeSav: new Date(),
							dateTimeEvt: new Date(),
							branchId: null,
							orderIdERP: null,
							errorType: null,
							userViewer: null
						};

						await this.broker.broadcast(
							'service.crmIso.saveLogCrmIso',
							logIso
						);
					}
				} catch (error) {
					valueOrderCheck.responseCode = 499;
					valueOrderCheck.response =
						'Erro ao enviar dados do Produto';
					valueOrderCheck.validations_ok = 0;

					messageOrders.status =
						StatusIntegrador.errorProtheus + 'Produto';

					loggerElastic(
						this.indexName,
						'499',
						this.originLayer,
						this.serviceName,
						JSON.stringify(error.message)
					);
				}

				this.broker.broadcast(
					'service-integration-updatedStatus', //'service.integration.order.orderCheck',
					messageOrders //valueOrderCheck
				);

				if (
					valueOrderCheck.responseCode != 200 &&
					valueOrderCheck.responseCode < 500
				) {
					messageOrders.status =
						StatusIntegrador.errorProtheus + 'Produto';

					const updateIso = {
						cEmpresa: '11',
						cNumCRM: message.orderId,
						enumStatusIso: StatusIso.seventeen
					};

					await this.broker.broadcast(
						'service-integration-updateSetIso',
						updateIso
					);

					const logIso: IConfigLogCrmIso = {
						orderId: message.orderId,
						name: StatusIntegrador.errorProtheus + 'Produto',
						status: 'FALHA',
						description:
							'Status ' +
							StatusIso.seventeen +
							' - ' +
							JSON.stringify(responseProduct.message),
						dateTimeSav: new Date(),
						dateTimeEvt: new Date(),
						branchId: null,
						orderIdERP: null,
						errorType: null,
						userViewer: null
					};

					await this.broker.broadcast(
						'service.crmIso.saveLogCrmIso',
						logIso
					);
				}
			} else {
				loggerElastic(
					this.indexName,
					'400',
					this.originLayer,
					this.serviceName,
					JSON.stringify(token)
				);
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
}
