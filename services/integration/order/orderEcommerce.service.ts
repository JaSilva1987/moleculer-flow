import { CronJob } from 'cron';
import { format, sub } from 'date-fns';
import * as dotenv from 'dotenv';
import {
	Service as MoleculerService,
	ServiceBroker,
	ServiceSchema
} from 'moleculer';
import { Event, Service } from 'moleculer-decorators';
import { statusEcommerceIntegration } from '../../../src/enum/integration/statusEcommerceProducts.enum';
import {
	IConfirmOrderSuccess,
	IOrderRequest
} from '../../../src/interface/climba/order/orderRequest.interface';
import {
	ICustomerDataSimple,
	IPostCustomer
} from '../../../src/interface/erpProtheus/customer/customer.interface';
import { IPaymentCondition } from '../../../src/interface/erpProtheus/payment/paymentCondition.interface';
import {
	IAItemPedido,
	IAPagamento,
	IGenerateOrders,
	IGenerateSend,
	IOF
} from '../../../src/interface/integration/order';
import { IOrderRequestEcommerceIntegration } from '../../../src/interface/integration/order/orderRequestEcommerce.interface';
import { EcommerceOrderRequestIntegrationRepository } from '../../../src/repository/integration/order/orderEcommerce.repository';
import { apmElasticConnect, loggerElastic } from '../../library/elasticSearch';
import { removerAcentos } from '../../library/erpProtheus';
import { EcommerceProductIntegrationRepository } from '../../../src/repository/integration/product/ecommerce.repository';

dotenv.config();
@Service({
	name: 'service.integrationecommerce.orderrequest',
	group: 'flow-climba'
})
export default class ProductsEcommerceService extends MoleculerService {
	public constructor(public broker: ServiceBroker, schema: ServiceSchema) {
		super(broker);

		this.cronJobOne = new CronJob(
			process.env.CRON_RETRYORDERS_NOT_SUCCESS,
			async () => {
				try {
					this.broker.broadcast(
						'ecommerce.integration.getorderrequestEcommerce',
						process.env.CLIMBA_REQUEST_ATIVE
					);
				} catch {
					new Error('Cron not run');
				}
			}
		);

		if (!this.cronJobOne.running) this.cronJobOne.start();

		this.cronJobOne2 = new CronJob(
			process.env.CRON_SENDCONFIRMATION_SUCCESS,
			async () => {
				try {
					this.broker.broadcast(
						'ecommerce.integration.getorderrequestSuccess',
						process.env.CLIMBA_REQUEST_ATIVE
					);
				} catch {
					new Error('Cron not run');
				}
			}
		);

		if (!this.cronJobOne2.running) this.cronJobOne2.start();
	}

	public indexName = 'flow-ecommerce-orderrequest';
	public serviceName = 'integration.order.service';
	public originLayer = 'integration';

	@Event({
		name: 'ecommerce.integration.getorderrequestEcommerce',
		group: 'flow-climba'
	})
	public async getOrderRequestEcommerce(enabled: string) {
		if (enabled === 'true') {
			try {
				this.logger.info(
					'==============BUSCA ORDER REQUEST COM ERRORs=============='
				);

				const repository = EcommerceOrderRequestIntegrationRepository;

				const getOrderError =
					await repository.GetEcommerceOrderRequestIntegrationError();

				if (getOrderError.length > 0) {
					for (const order of getOrderError) {
						if (
							order.JSON != 'Dados gravado no pré processamento'
						) {
							const jsonSendOf: IGenerateOrders = JSON.parse(
								order.JSON
							);

							const orderRequestIntegration: IOrderRequestEcommerceIntegration =
								{
									idOrder: order.idOrder,
									statusOrder: order.statusOrder,
									JSON: JSON.stringify(jsonSendOf),
									JSONRetorno: '',
									status: statusEcommerceIntegration.toIntegration,
									createdAt: new Date(),
									updatedAt: new Date()
								};

							const sendOF: IGenerateSend = {
								jsonPost: jsonSendOf,
								tenantId: '11,001043',
								dataOrder: orderRequestIntegration
							};

							await this.broker.broadcast(
								'service-erp-protheus-generateSaveOrderEcommerce',
								sendOF
							);
						} else {
							await this.broker.broadcast(
								'ecommerce.integration.postOrderRequestRetry',
								order.idOrder
							);
						}
					}
				}
			} catch (error) {
				loggerElastic(
					this.indexName,
					'499',
					this.originLayer,
					this.serviceName,
					JSON.stringify('Busca ordem com erros para reenvio'),
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
		name: 'ecommerce.integration.postOrderRequestRetry',
		group: 'flow-climba'
	})
	public async postOrderRequestRetry(orderId: string) {
		this.serviceName = 'postOrderRequestRetry';
		try {
			await this.broker.emit(
				'service.climba.orderRequest.getOrderRequestByOrderId',
				orderId
			);
		} catch (error) {
			loggerElastic(
				this.indexName,
				'499',
				this.originLayer,
				this.serviceName,
				JSON.stringify(
					'Busca ordens integradas com sucesso para confirmação'
				),
				JSON.stringify(error.message)
			);
			apmElasticConnect
				.setTransactionName(this.indexName)
				.captureError(new Error(error.message))
				.endTransaction();
		}
	}

	@Event({
		name: 'ecommerce.integration.getorderrequestSuccess',
		group: 'flow-climba'
	})
	public async getOrderRequestSuccessEcommerce(enabled: string) {
		this.serviceName = 'GetOrderResquestSuccessEcommerce';
		if (enabled === 'true') {
			try {
				this.logger.info(
					'==============BUSCA ORDER REQUEST INTEGRADAS COM SUCESSO=============='
				);

				const repository = EcommerceOrderRequestIntegrationRepository;

				const nowDate = new Date();
				const endDate = format(nowDate, 'yyyy-MM-dd HH:mm:ss');
				const startDate = format(
					sub(nowDate, { minutes: 1 }),
					'yyyy-MM-dd HH:mm:ss'
				);

				const getOrderSuccess =
					await repository.GetEcommerceOrderRequestIntegrationSuccess(
						startDate,
						endDate,
						'success'
					);

				if (getOrderSuccess.length > 0) {
					for (const order of getOrderSuccess) {
						const jsonSendOf: IConfirmOrderSuccess = {
							orderId: order.idOrder,
							orderConfirm: {
								orderExportedToErp: true
							}
						};

						await this.broker.broadcast(
							'service.climba.order.confirmOrder',
							jsonSendOf
						);
					}
				}
			} catch (error) {
				loggerElastic(
					this.indexName,
					'499',
					this.originLayer,
					this.serviceName,
					JSON.stringify(
						'Busca ordens integradas com sucesso para confirmação'
					),
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
		name: 'ecommerce.integration.orderrequestEcommerce',
		group: 'flow-climba'
	})
	public async orderRequestEcommerce(message: IOrderRequest) {
		try {
			this.logger.info(
				'==============INTEGRATION ORDER REQUEST=============='
			);
			let response;
			let numberCpf: string;
			let status: string = statusEcommerceIntegration.toIntegration;
			const repository = EcommerceOrderRequestIntegrationRepository;
			const repositoryProduct = EcommerceProductIntegrationRepository;

			const orderRequestIntegration: IOrderRequestEcommerceIntegration = {
				idOrder: message.id,
				statusOrder: message.statusDescription,
				JSON: 'Dados gravado no pré processamento',
				JSONRetorno: '',
				status: statusEcommerceIntegration.toIntegration,
				createdAt: new Date(),
				updatedAt: new Date()
			};

			let existOrder =
				await repository.GetEcommerceOrderRequestIntegration(
					orderRequestIntegration.idOrder
				);

			if (existOrder.length == 0) {
				response =
					await repository.PostEcommerceOrderRequestIntegration(
						orderRequestIntegration
					);
			}

			let formPaymentCondition: string;
			let getCondition: boolean = false;
			let idPaymentCondition;
			switch (message.payment.paymentType) {
				case 'bank_slip':
					if (message.payment.description == 'Pix') {
						formPaymentCondition = 'PI';
						idPaymentCondition = 'V59';
					} else {
						formPaymentCondition = 'R$';
						idPaymentCondition = 'F08';
					}
					break;

				default:
					formPaymentCondition = 'CC';
					getCondition = true;
					break;
			}
			const paymentCondition: IPaymentCondition = {
				form: formPaymentCondition,
				ecommerceInstallment: message.installmentQuantity
			};
			//busca codPagamento

			if (getCondition == true) {
				const requestPaymentCondition: any =
					await this.broker.broadcast(
						'service.erpProtheusViveo.payment.getPaymentCondition',
						paymentCondition
					);

				idPaymentCondition =
					requestPaymentCondition[0][0].message.data.id;
			}

			if (message.customer.documents[0].type == 'cpf') {
				numberCpf = message.customer.documents[0].number;
			}

			//Busca ou cadastra cliente
			const getCustomer: any = await this.broker.broadcast(
				'service.erpProtheusViveo.customer.getcustomer',
				numberCpf
			);

			const codeCity: any = await this.broker.broadcast(
				'service.erpProtheusViveo.city.getcity',
				{
					city: (
						await removerAcentos(
							message.customer.shippingAddress.city
						)
					).toUpperCase(),
					country: (
						await removerAcentos(
							message.customer.shippingAddress.state
						)
					).toUpperCase(),
					cep: message.customer.shippingAddress.zipCode
				}
			);

			if (codeCity[0][0].code == 400 || codeCity[0][0].status == 400) {
				orderRequestIntegration.status =
					statusEcommerceIntegration.erro;
				orderRequestIntegration.JSONRetorno = `Dados não encontrado para a Cidade ${message.customer.shippingAddress.city} ${message.customer.shippingAddress.state}`;

				response = await repository.PutEcommerceOrderRequestIntegration(
					orderRequestIntegration,
					existOrder[0].id
				);

				return;
			}

			let dataCustomer: ICustomerDataSimple | any = {
				name: message.customer.name.replace('\\', '').replace(/'/g, ''),
				fantasyName: message.customer.name.replace('\\', ''),
				address: `${message.customer.shippingAddress.street.replace(
					'\\',
					''
				)}, ${message.customer.shippingAddress.streetNumber}`,
				person: 'F',
				state: message.customer.shippingAddress.state.replace('\\', ''),
				city: codeCity[0][0].codeCounty,
				district: message.customer.shippingAddress.district.replace(
					'\\',
					''
				),
				zipCode: message.customer.shippingAddress.zipCode,
				ddd: message.customer.phones[0].number.substring(0, 2),
				phone: message.customer.phones[0].number,
				cpf: numberCpf,
				email: message.customer.email.replace('\\', ''),
				codeEcommerce: message.customer.id,
				store: '',
				country: '',
				codCountry: '',
				type: '',
				ticket: '',
				account: '',
				seller: '',
				pharmacy: '',
				niche: '',
				subNiche: '',
				customerActivity: '',
				category: '',
				codeCRM: '',
				codeCorporate: '',
				storeCorporate: '',
				codeLX: '',
				codeISOCRM: '',
				codeShipping: '',
				storeShipping: '',
				block: '',
				taxGroup: '',
				highlightSE: '',
				collectISS: '',
				typePerson: 'PF',
				calculateINSS: '',
				customerSegment: '0002',
				customerClassification: '0025',
				customerResponsible: '7015'
			};

			if (getCustomer[0][0]?.status == 200) {
				if (getCustomer[0][0].message.total > 1) {
					dataCustomer.code =
						getCustomer[0][0].message.data.customer[0].CodigoCliente;
					dataCustomer.store =
						getCustomer[0][0].message.data.customer[0].Loja;
				} else if (getCustomer[0][0].message.total == 1) {
					dataCustomer.code =
						getCustomer[0][0].message.data.customer.CodigoCliente;
					dataCustomer.store =
						getCustomer[0][0].message.data.customer.Loja;
				}

				const putDataCustomer: IPostCustomer = {
					customer: [dataCustomer]
				};

				const requestPutCustomer: any = await this.broker.broadcast(
					'service.erpProtheusViveo.customer.putcustomer',
					putDataCustomer
				);

				if (requestPutCustomer[0][0].status == 200) {
					dataCustomer.CodigoCliente =
						requestPutCustomer[0][0]?.message?.details[0]?.codeCustomer;
				} else {
					orderRequestIntegration.status =
						statusEcommerceIntegration.erro;
					orderRequestIntegration.JSONRetorno = `Atualização do Customer não realizada`;

					response =
						await repository.PutEcommerceOrderRequestIntegration(
							orderRequestIntegration,
							existOrder[0].id
						);

					return;
				}
			} else {
				const postDataCustomer: IPostCustomer = {
					customer: [dataCustomer]
				};

				const requestPostCustomer: any = await this.broker.broadcast(
					'service.erpProtheusViveo.customer.postcustomer',
					postDataCustomer
				);

				if (requestPostCustomer[0][0].status == 200) {
					dataCustomer.CodigoCliente =
						requestPostCustomer[0][0]?.message?.details[0]?.codeCustomer;
				} else {
					orderRequestIntegration.status =
						statusEcommerceIntegration.erro;
					orderRequestIntegration.JSONRetorno = `Atualização do Customer não realizada`;

					response =
						await repository.PutEcommerceOrderRequestIntegration(
							orderRequestIntegration,
							existOrder[0].id
						);

					return;
				}
			}

			const aPagto: IAPagamento = {
				cCodCTR: message.payment.transactionId,
				cPDV: 'ECOMMERCE',
				cNSU: message.payment.nsu,
				cNSUHost: '',
				cData: format(
					Date.parse(message.payment.paymentDate),
					'yyyy-MM-dd'
				),
				cHora: format(
					Date.parse(message.payment.paymentDate),
					'HH:mm:ss'
				),
				cCNPJ: '',
				nTaxa: 0,
				nValor: message.totalValue,
				nBandeira: 0
			};

			let itemPedido: IAItemPedido[] = [];
			for (const order of message.items) {
				const productData =
					await repositoryProduct.GetEcommerceProductIntegration(
						order.productId,
						order.sku
					);

				let valorSIpi = order.sellingPrice;
				let valorIpi = 0;
				let qtdeValorSIpi = 0;

				if (productData[0]?.originProduct == 'I') {
					const percIpi = productData[0].IPI / 100;
					const percCalcIpi = 1 + percIpi;
					valorSIpi = order.sellingPrice / percCalcIpi;
					valorIpi = order.sellingPrice - valorSIpi;
					qtdeValorSIpi = valorSIpi * order.quantity;
				}

				const aItemPedidos: IAItemPedido = {
					cProduto: order.productId,
					cItemCRM: '1',
					nQtdeVenda: order.quantity,
					nPrecoUnit: valorSIpi.toFixed(2),
					nValUnLista: valorSIpi.toFixed(2),
					nValorUnitLiquido: valorSIpi.toFixed(2),
					FatorConversao: 0,
					FatorConversaoCaixa: 0,
					UMOrigem: 'UN',
					cUMComercial: '',
					cTpOperacao: '01',
					cArmazem: 'ECOM',
					cListaCome: '000000000000000',
					nValUnCRM: order.sellingPrice,
					nQtdeComercial: order.quantity,
					nValUnComercial: valorSIpi.toFixed(2),
					cItemPedCli: 0,
					cNumPedCli: '',
					dDtFaturamentoItem: format(
						Date.parse(message.orderDate),
						'yyyy-MM-dd'
					),
					nValorIPI: (valorIpi * order.quantity).toFixed(2),
					nValorST: 0,
					nValorICMS: 0,
					nValorPIS: 0,
					nValorCOFINS: 0,
					nValorFCPS: 0,
					nValorFCP: 0,
					cExcluido: 'N',
					cOpLogistica: 'N',
					nValorUnitTotal: qtdeValorSIpi.toFixed(2),
					aLotePorItem: [],
					nM3Item: 0,
					nQtdeEntregue: order.quantity
				};

				itemPedido.push(aItemPedidos);
			}

			const OF: IOF = {
				cEmpresa: '11',
				cBranchId: '001043',
				cCondPagamento: idPaymentCondition,
				cOrigem: 'ECOMMERCE',
				cTipoPedido: 'N',
				cEstVirtual: 'N',
				cDesconto: message.discountValue,
				cCodCliente:
					dataCustomer.CodigoCliente || dataCustomer[0].CodigoCliente,
				cLoja: dataCustomer.store || '0001',
				cClienteEntrega: '',
				cLojaEntrega: '',
				cCondPagamentoCRM: '',
				cNumCRM: message.id,
				dDataCRM: format(Date.parse(message.orderDate), 'yyyy-MM-dd'),
				dHoraCRM: format(Date.parse(message.orderDate), 'HH:mm:ss'),
				cTransportadora: '100095',
				cTipoFrete: 'C',
				nFrete: message.shippingValue,
				cSeqEndEn: '',
				nMoeda: 1,
				cNtEmpenho: '',
				cCodClieISO: 0,
				dDtLibCred: '',
				dDtFaturamento: format(
					Date.parse(message.orderDate),
					'yyyy-MM-dd'
				),
				cLicitacao: 'N',
				cPortal: 'S',
				cIDPortal: 'ICW',
				cMsgNFE: ' ',
				cMsgExpedicao: '',
				cHrLibCred: '',
				cUserLibCred: '',
				cLoteUnico: 'N',
				TipoRemessa: 'N',
				cVencProx: 'N',
				cCaixaFechada: 'S',
				cFatParcial: 'N',
				cMesesVencProx: 0,
				cCodBU: 'CONS',
				cPrioridadeCliente: '9',
				nDiasAlocacaoFuturo: 0,
				TotalLinhas: 0,
				ValidaConversao: 'OK',
				ValidaTotalLinhas: 'OK',
				nM3Total: 0,
				aPagamentos: [aPagto],
				aItemPedido: itemPedido,
				cStatus: '1',
				cGrupoTrib: 'C06',
				lPagamento: false
			};

			const jsonSendOf: IGenerateOrders = {
				OF: [OF]
			};

			existOrder = await repository.GetEcommerceOrderRequestIntegration(
				orderRequestIntegration.idOrder
			);

			orderRequestIntegration.JSON = JSON.stringify(jsonSendOf);

			if (existOrder.length > 0) {
				if (
					existOrder[0].status != statusEcommerceIntegration.success
				) {
					response =
						await repository.PutEcommerceOrderRequestIntegration(
							orderRequestIntegration,
							existOrder[0].id
						);
				}
				status = existOrder[0].status;
			}

			const sendOF: IGenerateSend = {
				jsonPost: jsonSendOf,
				tenantId: '11,001043',
				dataOrder: orderRequestIntegration
			};

			if (status != statusEcommerceIntegration.success) {
				await this.broker.broadcast(
					'service-erp-protheus-generateSaveOrderEcommerce',
					sendOF
				);
			}

			loggerElastic(
				this.indexName,
				'200',
				this.originLayer,
				this.serviceName,
				JSON.stringify(message),
				JSON.stringify(response)
			);
		} catch (error) {
			loggerElastic(
				this.indexName,
				'499',
				this.originLayer,
				this.serviceName,
				JSON.stringify(message),
				JSON.stringify(error.message)
			);
			apmElasticConnect
				.setTransactionName(this.indexName)
				.captureError(new Error(error.message))
				.endTransaction();
		}
	}
}
