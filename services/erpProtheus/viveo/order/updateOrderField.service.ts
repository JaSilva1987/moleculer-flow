'use strict';

import * as dotenv from 'dotenv';
import {
	Service as MoleculerService,
	ServiceBroker,
	ServiceSchema
} from 'moleculer';
import { Event, Service } from 'moleculer-decorators';
import { StatusManutOf } from '../../../../src/enum/crmIso/enum';
import { IIIPoolCheckChangedOf } from '../../../../src/interface/crmIso/order';
import { IProcessManutOf } from '../../../../src/interface/crmIso/orderFat/updateManutOf.interface';
import { IGetToken } from '../../../../src/interface/erpProtheus/global';
import {
	IBodyOF,
	IItemPedido,
	IUpdateOrderField
} from '../../../../src/interface/erpProtheus/order';
import { AxiosRequestType } from '../../../library/axios';
import { loggerElastic } from '../../../library/elasticSearch';
import { getTokenUrlGlobal } from '../../../library/erpProtheus';
import { type } from 'os';

dotenv.config();
@Service({
	name: 'updateOrderField',
	group: 'flow-cremmer'
})
export default class UpdateOrderField extends MoleculerService {
	public allOrders: Object;

	public constructor(public broker: ServiceBroker, schema: ServiceSchema) {
		super(broker);
	}

	public indexName = 'flow-crmiso-manutof';
	public serviceName = 'UpdateOrderField.service';
	public originLayer = 'flow-cremmer';
	setTypeManut: string;

	@Event({
		name: 'service.erpProtheus.order.updateOrderField',
		group: 'cremer'
	})
	public async updateOrderField(ctxMessage: IIIPoolCheckChangedOf) {
		this.logger.info(
			'============== MANUTENCAO DE OFS - INICIANDO AS VALIDACOES PARA ENVIO PROTHEUS =============='
		);

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
					process.env.PROTHEUSVIVEO_URLORDER;

				const arrObjects: IItemPedido[] = [];
				const OFNew: IUpdateOrderField = {
					cNumOF: ctxMessage.orderIdERP.trim()
				};

				if (ctxMessage.aItemPedido.FatPar.trim() != '') {
					Object.assign(OFNew, {
						cFatParcial: ctxMessage.aItemPedido.FatPar.trim()
					});
				}

				if (ctxMessage.aItemPedido.Observacoes_NFE.trim() != '') {
					Object.assign(OFNew, {
						cMsgNFE: ctxMessage.aItemPedido.Observacoes_NFE.trim()
					});
				}

				if (ctxMessage.aItemPedido.Lote_unico.trim() != '') {
					Object.assign(OFNew, {
						cLoteUnico: ctxMessage.aItemPedido.Lote_unico
					});
				}

				if (ctxMessage.aItemPedido.Vcto_proximo.trim() != '') {
					Object.assign(OFNew, {
						cVencProx: ctxMessage.aItemPedido.Vcto_proximo.trim()
					});
				}

				if (ctxMessage.aItemPedido.Libera_abaixo_minimo.trim() != '') {
					Object.assign(OFNew, {
						cLiberaValMin:
							ctxMessage.aItemPedido.Libera_abaixo_minimo.trim()
					});
				}

				if (ctxMessage.aItemPedido.Data_Previsao_fat.trim() != '') {
					Object.assign(OFNew, {
						dDtFaturamento:
							ctxMessage.aItemPedido.Data_Previsao_fat.trim()
					});
				}

				if (ctxMessage.aItemPedido.CXFech.trim() != '') {
					Object.assign(OFNew, {
						cCaixaFechada: ctxMessage.aItemPedido.CXFech.trim()
					});
				}

				if (ctxMessage.aItemPedido.Valor_tolerancia != 0) {
					Object.assign(OFNew, {
						nValorTolerancia:
							ctxMessage.aItemPedido.Valor_tolerancia
					});
				}

				if (ctxMessage.resetPedidoIso.trim() == 'S') {
					Object.assign(OFNew, {
						cTipoCancelamento: 'R',
						cCancelaOF: 'S'
					});
				}

				if (ctxMessage.cancelPedido.trim() == 'S') {
					Object.assign(OFNew, {
						cTipoCancelamento: 'C',
						cCancelaOF: 'S'
					});
				}

				const itemOf: IItemPedido = {};

				if (
					ctxMessage.aItemPedido.Seq.toString().trim() != '' &&
					ctxMessage.aItemPedido.ITEM_Seq.trim() != ''
				) {
					Object.assign(itemOf, {
						cItemOF: ctxMessage.aItemPedido.ITEM_Seq.toString()
							.padStart(2, '0')
							.trim()
					});
				}

				if (
					ctxMessage.aItemPedido.ITEM_CancSaldo.trim() === 'S' &&
					ctxMessage.aItemPedido.ITEM_Seq.trim() != ''
				) {
					Object.assign(itemOf, {
						cCancelaItem:
							ctxMessage.aItemPedido.ITEM_CancSaldo.trim()
					});
				}

				if (
					ctxMessage.aItemPedido.ITEM_DataPrevFat.trim() != '' &&
					ctxMessage.aItemPedido.ITEM_Seq.trim() != ''
				) {
					Object.assign(itemOf, {
						dDtFaturamentoItem:
							ctxMessage.aItemPedido.ITEM_DataPrevFat.trim()
					});
				}

				if (ctxMessage.aItemPedido.ManOF_QuebraOF45M3.trim() != '') {
					Object.assign(OFNew, {
						cTipoProcessamentoM3:
							ctxMessage.aItemPedido.ManOF_QuebraOF45M3.trim()
					});
				}

				arrObjects.push(itemOf);

				const setArray = arrObjects.filter((mountObj) => {
					if (
						typeof mountObj === 'object' &&
						!Array.isArray(mountObj) &&
						Object.keys(mountObj).length === 0
					) {
						return false;
					} else {
						return true;
					}
				});

				if (setArray.length > 0) {
					this.setTypeManut = 'item';
					Object.assign(OFNew, {
						aItemPedido: setArray
					});
				} else {
					this.setTypeManut = 'header';
					Object.assign(OFNew, {
						aItemPedido: [
							{
								cItemOF: '01'
							}
						]
					});
				}

				let BodyOF = Object.fromEntries(
					Object.entries(OFNew).filter(
						([_, v]) => v != null && v !== '' && v !== 0
					)
				);

				let OF: IBodyOF = {
					OF: [BodyOF]
				};

				this.logger.info(
					'============== MANUTENCAO DE OFS  - JSON DE ENVIO PROTHEUS ==============\n' +
						JSON.stringify(OF, null, 2)
				);

				const response = await AxiosRequestType(
					urlProtheusOrder,
					OF,
					'put',
					{
						Authorization: 'Bearer ' + token.access_token,
						tenantId: `'${ctxMessage.tenantId},${ctxMessage.branchId}'`
					}
				);

				this.logger.info(
					'============== MANUTENCAO DE OFS  - RETORNO DO PROCESSAMENTO PROTHEUS ==============\n' +
						JSON.stringify(response) +
						'\n ======================================================'
				);

				if (response.status != 500) {
					const processManut: IProcessManutOf = {
						tenantId: ctxMessage.tenantId,
						orderId: ctxMessage.orderId,
						orderIdERP: ctxMessage.orderIdERP,
						branchId: ctxMessage.branchId,
						sourceCRM: ctxMessage.sourceCrm,
						statusCode: response.status,
						manutType: this.setTypeManut,
						jsonCrm: JSON.stringify(ctxMessage),
						jsonErp: JSON.stringify(response),
						createdAt: new Date(),
						updatedAt: new Date(),
						status: StatusManutOf.Processing
					};

					await this.broker.broadcast(
						'service.integration.orderFat.updateManutOf',
						processManut
					);
				}

				loggerElastic(
					this.indexName,
					'200',
					this.originLayer,
					this.serviceName,
					JSON.stringify(response)
				);
			}
		} catch (error) {
			loggerElastic(
				this.indexName,
				'499',
				this.originLayer,
				this.serviceName,
				JSON.stringify(error.ctxMessage)
			);
		}
	}
}
