import { ServiceBroker, ServiceSchema } from 'moleculer';
import moment from 'moment';
import { removeEspecialCharacters } from '../../../../services/library/crmiso/removeEspecialCharacters';
import { loggerElastic } from '../../../../services/library/elasticSearch';
import { IPoolQueryOrders } from '../../../interface/crmIso/order';
import {
	APedidos,
	IItemsLot,
	IOrderMessage,
	IPaymentsOrders
} from '../../../interface/crmIso/order/poolCrmOrders.interface';
import { IPaymentConditionFlow } from '../../../interface/erpProtheus/payment/paymentCondition.interface';
import { CheckOrdersRepository } from '../../../repository/crmIso/order/ordersCrmIso.repository';
import { PostCheckCardPayments } from '../../../repository/crmIso/payments/checkCardPayments.repository';
import { SubsidiaryCheckRepository } from '../../../repository/integration/company/subsidiaryCheck.repository';
import { PaymentCheckRepository } from '../../../repository/integration/payment/paymentCondition.repository';

export class PoolCrmIsoOrdersController {
	public indexName = 'flow-integration-routeorders';
	public serviceName = 'PoolCrmIsoOrdersController';
	public originLayer = 'crmiso';
	public checkPayments: any;
	public conditionApi: any;

	public constructor(public broker: ServiceBroker, schema: ServiceSchema) {}

	public async PrepareMessage(): Promise<IOrderMessage | any> {
		try {
			const ordersCrmReturn: any[] = [];

			const allPoolCrmOrders: IPoolQueryOrders[] =
				await CheckOrdersRepository.GetAllByCrmOrders();

			if (
				typeof allPoolCrmOrders != 'undefined' &&
				allPoolCrmOrders != null &&
				allPoolCrmOrders.length > 0
			) {
				const ordersWithoutDuplicates: IPoolQueryOrders[] =
					await this.removeDuplicates(allPoolCrmOrders);

				for (const allPoolAllCrmOrders of JSON.parse(
					JSON.stringify(ordersWithoutDuplicates).replace(
						/\:null/gi,
						':""'
					)
				)) {
					this.checkPayments =
						await PaymentCheckRepository.GetPayCondition(
							String(allPoolAllCrmOrders.ISOEmp_Codigo),
							1,
							allPoolAllCrmOrders.ISOPvPed_Pagamento.trim()
						);

					if (!this.checkPayments) {
						const filterPaymentsCode: IPaymentConditionFlow = {
							filter: `${allPoolAllCrmOrders.ISOPvPed_Pagamento.trim()}`
						};

						this.checkPayments = await this.broker.emit(
							'erpProtheusViveo.payment.getPaymentFlow',
							filterPaymentsCode
						);

						if (typeof this.checkPayments === 'object') {
							this.checkPayments = this.checkPayments[0];
						}
					}

					if (
						!this.checkPayments ||
						!this.checkPayments.cod_cond_pagto_erp
					) {
						this.checkPayments = 'S/ COND. DE PAGTO.';
					}

					const checkSubsidiary =
						await SubsidiaryCheckRepository.GetSubsidiary(
							String(allPoolAllCrmOrders.ISOEmp_Codigo),
							1,
							String(
								allPoolAllCrmOrders.ISOPvCD_Estabelecimento_LX
							)
						);

					let jsonOrders: IOrderMessage = {
						cEmpresa: allPoolAllCrmOrders.ISOEmp_Codigo.toString(),
						cBranchId: checkSubsidiary.cod_filial_erp,
						cCondPagamento:
							typeof this.checkPayments === 'string' &&
							this.checkPayments !== null &&
							this.checkPayments !== undefined
								? this.checkPayments
								: typeof this.checkPayments === 'object' &&
								  this.checkPayments !== null &&
								  this.checkPayments !== undefined &&
								  typeof this.checkPayments
										.cod_cond_pagto_erp === 'string' &&
								  this.checkPayments.cod_cond_pagto_erp !==
										null &&
								  this.checkPayments.cod_cond_pagto_erp !==
										undefined
								? this.checkPayments.cod_cond_pagto_erp
								: 'S/ COND. DE PAGTO.',
						cOrigem: 'ISOCRM',
						cTipoPedido: 'N',
						cEstVirtual: 'N',
						cCodCliente:
							allPoolAllCrmOrders.ISOEmpEnt_CliCod_ERP_CODIGO,
						cLoja: allPoolAllCrmOrders.ISOEmpEnt_CliCod_ERP_Loja,
						cClienteEntrega:
							allPoolAllCrmOrders.ISOPvPed_CliTG == ''
								? ''
								: allPoolAllCrmOrders.ISOPvPed_CliTG.trim(),
						cLojaEntrega:
							allPoolAllCrmOrders.ISOPvPed_LOJTG == ''
								? ''
								: allPoolAllCrmOrders.ISOPvPed_LOJTG.trim(),
						cCondPagamentoCRM:
							allPoolAllCrmOrders.ISOPvPed_Pagamento == ''
								? ''
								: allPoolAllCrmOrders.ISOPvPed_Pagamento.trim(),
						cNumCRM:
							allPoolAllCrmOrders.ISOPvPed_Codigo.toString() == ''
								? ''
								: String(allPoolAllCrmOrders.ISOPvPed_Codigo)
										.padStart(8, '0')
										.trim(),
						dDataCRM:
							allPoolAllCrmOrders.ISOPvPed_DtaPedido.toString() ==
							''
								? ''
								: moment(allPoolAllCrmOrders.ISOPvPed_DtaPedido)
										.format('YYYY-MM-DD')
										.trim(),
						dHoraCRM:
							allPoolAllCrmOrders.ISOPvPed_HoraPedido == ''
								? ''
								: allPoolAllCrmOrders.ISOPvPed_HoraPedido.trim(),
						cTransportadora:
							allPoolAllCrmOrders.ISOPvPedido_CodigoTRP.trim(),
						cTipoFrete:
							allPoolAllCrmOrders.ISOPvPedidoTipoFrete.trim(),
						nFrete: allPoolAllCrmOrders.ISOPvPed_ValorFrete,
						cSeqEndEn:
							allPoolAllCrmOrders.ISOPvPed_CodEndEntrega.toString().trim(),
						nMoeda: allPoolAllCrmOrders.ISOMoe_Codigo,
						cNtEmpenho: await removeEspecialCharacters(
							allPoolAllCrmOrders.ISOPvPedido_NumeroEmpenho
						),
						cCodClieISO: allPoolAllCrmOrders.ISOPvPed_CliCodigo,
						dDtLibCred:
							allPoolAllCrmOrders.ISOWFTrf_DataLiberacaoCredito ==
							''
								? ''
								: moment(
										allPoolAllCrmOrders.ISOWFTrf_DataLiberacaoCredito
								  )
										.format('YYYY-MM-DD')
										.trim(),
						dDtFaturamento:
							allPoolAllCrmOrders.ISOPvPed_DtaPrevFat.toString().trim() ==
							''
								? ''
								: moment(
										allPoolAllCrmOrders.ISOPvPed_DtaPrevFat
								  )
										.format('YYYY-MM-DD')
										.trim(),
						cLicitacao:
							allPoolAllCrmOrders.IsoPVPed_LICITA == ''
								? ''
								: allPoolAllCrmOrders.IsoPVPed_LICITA.trim(),
						cPortal:
							allPoolAllCrmOrders.IsoPVPed_PORTAL == ''
								? ''
								: allPoolAllCrmOrders.IsoPVPed_PORTAL.trim(),
						cIDPortal:
							allPoolAllCrmOrders.IsoPVPed_IDPORT == ''
								? ''
								: allPoolAllCrmOrders.IsoPVPed_IDPORT.trim(),
						cMsgNFE: await removeEspecialCharacters(
							allPoolAllCrmOrders.OBSERVACAO_NF
						),
						cMsgExpedicao: await removeEspecialCharacters(
							allPoolAllCrmOrders.OBSERVACAO_TRACKING
						),
						cHrLibCred:
							allPoolAllCrmOrders.ISOWFTrf_HoraLiberacaoCredito ==
							''
								? ''
								: moment(
										allPoolAllCrmOrders.ISOWFTrf_HoraLiberacaoCredito
								  )
										.format('HH:mm:ss')
										.trim(),
						cUserLibCred:
							allPoolAllCrmOrders.ISOWFTrf_CodigoAtendente == ''
								? ''
								: allPoolAllCrmOrders.ISOWFTrf_CodigoAtendente.trim(),
						cLoteUnico:
							allPoolAllCrmOrders.ISOPvPed_CliLotUni == ''
								? ''
								: allPoolAllCrmOrders.ISOPvPed_CliLotUni.trim(),
						TipoRemessa:
							allPoolAllCrmOrders.ISOPvPedTip_Codigo == ''
								? ''
								: allPoolAllCrmOrders.ISOPvPedTip_Codigo.trim() ==
								  ('VORDE' || 'VIND')
								? 'S'
								: 'N',
						cVencProx:
							allPoolAllCrmOrders.ISOPvPed_CliVctPrx == ''
								? ''
								: allPoolAllCrmOrders.ISOPvPed_CliVctPrx.trim(),
						cCaixaFechada:
							allPoolAllCrmOrders.ISOPvPed_CliCXFec == ''
								? ''
								: allPoolAllCrmOrders.ISOPvPed_CliCXFec.trim(),
						cFatParcial:
							allPoolAllCrmOrders.ISOPvPed_CliFatParc == ''
								? ''
								: allPoolAllCrmOrders.ISOPvPed_CliFatParc.trim(),
						cMesesVencProx:
							allPoolAllCrmOrders.IsoPvPed_CliMesVctPrx,
						cCodBU:
							allPoolAllCrmOrders.CLIENTE_BU == ''
								? ''
								: allPoolAllCrmOrders.CLIENTE_BU.trim(),
						cPrioridadeCliente:
							allPoolAllCrmOrders.ISOPVPed_CLIPRIORIDADE == ''
								? ''
								: allPoolAllCrmOrders.ISOPVPed_CLIPRIORIDADE.trim(),
						nDiasAlocacaoFuturo:
							allPoolAllCrmOrders.ISOPvPed_CLIDIASALOCFUT,
						TotalLinhas:
							allPoolAllCrmOrders.ISOPvPedIte_TotalLinhas,
						ValidaConversao: 'OK',
						ValidaTotalLinhas: 'OK',
						nM3Total: allPoolAllCrmOrders.ISOPvPedIte_TotalLinhas,
						aPagamentos: [],
						aItemPedido: []
					};

					const checkPaymentCart =
						await PostCheckCardPayments.GetOnePaymentCard(
							Number(jsonOrders.cNumCRM),
							jsonOrders.cCodClieISO
						);

					if (checkPaymentCart.ZPT110_ZPT_VALOR > 0) {
						const resultPayment: IPaymentsOrders = {
							cCodCTR: checkPaymentCart.ZPT110_ZPT_CODCTR,
							cPDV: checkPaymentCart.ZPT110_ZPT_PDV,
							cNSU: checkPaymentCart.ZPT110_ZPT_NSU,
							cNSUHost: checkPaymentCart.ZPT110_ZPT_NSUHST,
							cData: moment(
								checkPaymentCart.ZPT110_ZPT_DATA,
								'yyyymmdd'
							).format('YYYY-MM-DD'),
							cHora: checkPaymentCart.ZPT110_ZPT_HORA,
							cCNPJ: checkPaymentCart.ZPT110_ZPT_CNPJC,
							nTaxa: checkPaymentCart.ZPT110_ZPT_TAXA,
							nValor: checkPaymentCart.ZPT110_ZPT_VALOR,
							nBandeira: checkPaymentCart.ZPT110_ZPT_BANDEI
						};

						jsonOrders.aPagamentos.push(resultPayment);
					}

					const allPoolQueryCrmOrders =
						await CheckOrdersRepository.GetAllByOrders(
							Number(jsonOrders.cNumCRM),
							String(jsonOrders.cCodClieISO)
						);

					for (let c = 0; c < allPoolQueryCrmOrders.length; c++) {
						const itensOrder: APedidos = {
							cProduto:
								allPoolQueryCrmOrders[c].ISOPrd_Codigo.trim() ||
								'',
							cItemCRM: String(
								allPoolQueryCrmOrders[c].ISOPvPedIte_Codigo
							),
							nQtdeVenda:
								allPoolQueryCrmOrders[c]
									.ISOPvPedIte_Qtd_UM_estoque,
							nPrecoUnit:
								allPoolQueryCrmOrders[c]
									.ISOPvPedIte_PrecoUNESTIntegracaoBO,
							nValUnLista:
								allPoolQueryCrmOrders[c].ISOPvPedIte_PrecoLista,
							nValorUnitLiquido:
								allPoolQueryCrmOrders[c].Vlr_unit_LIQUIDO,
							FatorConversao:
								allPoolQueryCrmOrders[c]
									.ISOPrdUndFatC_FatorConversao,
							FatorConversaoCaixa:
								allPoolQueryCrmOrders[c]
									.ISOPrdUndFatC_FatorConversaoCX,
							UMOrigem:
								allPoolQueryCrmOrders[
									c
								].ISOPvPedIte_UnidadeOrigem.trim() || '',
							cUMComercial:
								allPoolQueryCrmOrders[
									c
								].Item_QTD_UnidadeDestino.trim() || '',
							cTpOperacao:
								allPoolQueryCrmOrders[
									c
								].ISOPvPed_Operacao.trim() || '',
							cArmazem:
								allPoolQueryCrmOrders[
									c
								].ISOPvPedIte_Armazem.trim() || '',
							cListaCome:
								allPoolQueryCrmOrders[
									c
								].ISOEmpEnt_Tabela_Preco.padStart(
									15,
									'0'
								).trim() || '',
							nValUnCRM:
								allPoolQueryCrmOrders[c]
									.ISOPvPedIte_Vlr_Total_Unitario_EST,
							nQtdeComercial:
								allPoolQueryCrmOrders[c].Item_Quantidade,
							nValUnComercial:
								allPoolQueryCrmOrders[c]
									.ISOPvPedIte_PrecoCMLIntegracaoBO,
							cItemPedCli:
								allPoolQueryCrmOrders[c]
									.ISOPvPedIte_LinhaOrdemCompra,
							cNumPedCli:
								allPoolQueryCrmOrders[
									c
								].ISOPvPedIte_NrOrdemCompra.trim() || '',
							dDtFaturamentoItem:
								moment(
									allPoolQueryCrmOrders[c]
										.ISOPvPedIte_DtaSolEntrega
								)
									.format('YYYY-MM-DD')
									.trim() || '',
							nValorIPI:
								allPoolQueryCrmOrders[c].ISOPvPedIte_ValorIPI ||
								0,
							nValorST:
								allPoolQueryCrmOrders[c]
									.ISOPvPedIte_VlrSubsTrib || 0,
							nValorICMS:
								allPoolQueryCrmOrders[c].ISOPvPedIte_ValorICMS,
							nValorPIS:
								allPoolQueryCrmOrders[c].ISOPvPedIte_ValorPIS,
							nValorCOFINS:
								allPoolQueryCrmOrders[c]
									.ISOPvPedIte_ValorCofins,
							nValorFCPS:
								allPoolQueryCrmOrders[c].ISOPVPedIte_ValorFCPST,
							nValorFCP:
								allPoolQueryCrmOrders[c].ISOPvPedIte_ValorFCP,
							cExcluido: 'N',
							cOpLogistica: 'N',
							nValorUnitTotal:
								allPoolQueryCrmOrders[c]
									.ISOPvPedIte_Vlr_Total_Unitario_EST,
							aLotePorItem: ([] = []),
							nM3Item: allPoolQueryCrmOrders[c].ISOPvPedIte_Codigo
						};

						itensOrder.cNumPedCli = await removeEspecialCharacters(
							itensOrder.cNumPedCli
						);

						if (jsonOrders.cCaixaFechada == 'S') {
							if (
								allPoolQueryCrmOrders[c]
									.ISOPvPedIte_Qtd_UM_estoque %
									allPoolQueryCrmOrders[c]
										.ISOPrdUndFatC_FatorConversaoCX >
								0
							) {
								if (jsonOrders.ValidaConversao != 'OK')
									jsonOrders.ValidaConversao =
										jsonOrders.ValidaConversao +
										' | produto ' +
										allPoolQueryCrmOrders[c].ISOPrd_Codigo +
										', qtd: ' +
										allPoolQueryCrmOrders[c]
											.ISOPrdUndFatC_FatorConversaoCX;
								else
									jsonOrders.ValidaConversao =
										' Cliente exige Caixa Fechada, verifique produto ' +
										allPoolQueryCrmOrders[c].ISOPrd_Codigo +
										', qtd: ' +
										allPoolQueryCrmOrders[c]
											.ISOPrdUndFatC_FatorConversaoCX;
							}
						}

						jsonOrders.aItemPedido.push(itensOrder);

						if (
							allPoolQueryCrmOrders[c].ISOPvPedIte_QtdeLote1 > 0
						) {
							const loteInsert: IItemsLot = {
								cLote: allPoolQueryCrmOrders[
									c
								].ISOPvPedIte_Lote1.trim(),
								dDtValidade: '',
								dDtFabricacao: '',
								nQuant: allPoolQueryCrmOrders[c]
									.ISOPvPedIte_QtdeLote1
							};

							itensOrder.aLotePorItem.push(loteInsert);
						}

						if (
							allPoolQueryCrmOrders[c].ISOPvPedIte_QtdeLote2 > 0
						) {
							const loteInsert: IItemsLot = {
								cLote: allPoolQueryCrmOrders[
									c
								].ISOPvPedIte_Lote2.trim(),
								dDtValidade: '',
								dDtFabricacao: '',
								nQuant: allPoolQueryCrmOrders[c]
									.ISOPvPedIte_QtdeLote2
							};

							itensOrder.aLotePorItem.push(loteInsert);
						}

						if (
							allPoolQueryCrmOrders[c].ISOPvPedIte_QtdeLote3 > 0
						) {
							const loteInsert: IItemsLot = {
								cLote: allPoolQueryCrmOrders[
									c
								].ISOPvPedIte_Lote3.trim(),
								dDtValidade: '',
								dDtFabricacao: '',
								nQuant: allPoolQueryCrmOrders[c]
									.ISOPvPedIte_QtdeLote3
							};

							itensOrder.aLotePorItem.push(loteInsert);
						}

						if (
							allPoolQueryCrmOrders[c].ISOPvPedIte_QtdeLote4 > 0
						) {
							const loteInsert: IItemsLot = {
								cLote: allPoolQueryCrmOrders[
									c
								].ISOPvPedIte_Lote4.trim(),
								dDtValidade: '',
								dDtFabricacao: '',
								nQuant: allPoolQueryCrmOrders[c]
									.ISOPvPedIte_QtdeLote4
							};

							itensOrder.aLotePorItem.push(loteInsert);
						}

						if (
							allPoolQueryCrmOrders[c].ISOPvPedIte_QtdeLote5 > 0
						) {
							const loteInsert: IItemsLot = {
								cLote: allPoolQueryCrmOrders[
									c
								].ISOPvPedIte_Lote5.trim(),
								dDtValidade: '',
								dDtFabricacao: '',
								nQuant: allPoolQueryCrmOrders[c]
									.ISOPvPedIte_QtdeLote5
							};

							itensOrder.aLotePorItem.push(loteInsert);
						}
					}

					ordersCrmReturn.push(jsonOrders);

					if (
						!allPoolAllCrmOrders.CLIENTE_BU ||
						allPoolAllCrmOrders.CLIENTE_BU === ' ' ||
						allPoolAllCrmOrders.CLIENTE_BU === '-'
					) {
						jsonOrders.ValidaConversao +=
							' / BU inválida para o pedido';
					}
				}

				return await ordersCrmReturn;
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

	public async removeDuplicates(
		orders: IPoolQueryOrders[]
	): Promise<IPoolQueryOrders[]> {
		const uniqueOrders: IPoolQueryOrders[] = [];

		for (const order of orders) {
			const foundOrder = uniqueOrders.find(
				(o) => o.ISOPvPed_Codigo == order.ISOPvPed_Codigo
			);
			if (!foundOrder) {
				uniqueOrders.push(order);
			}
		}

		return uniqueOrders;
	}
}
