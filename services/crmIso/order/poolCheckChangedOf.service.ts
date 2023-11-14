'use strict';

import * as dotenv from 'dotenv';
import {
	Service as MoleculerService,
	ServiceBroker,
	ServiceSchema
} from 'moleculer';
import { Event, Service } from 'moleculer-decorators';
import { SystemasViveo } from '../../../src/enum/global/enum';
import { VwFlowManutOfRepository } from '../../../src/repository/crmIso/order/vwFlowManutOf.repository';
import { loggerElastic } from '../../library/elasticSearch';

dotenv.config();
@Service({
	name: 'ordersIsoCrm',
	group: 'flow-cremmer'
})
export default class OrdersIsoCrm extends MoleculerService {
	public indexName = 'flow-crmiso-manutof';
	public serviceName = 'poolCheckChangedOf.service';
	public originLayer = 'crmiso';

	public constructor(public broker: ServiceBroker, schema: ServiceSchema) {
		super(broker);
	}

	@Event({
		name: 'service-crmIso-PoolCheckChangedOf',
		group: 'flow-cremmer'
	})
	public async PoolCheckChangedOf() {
		try {
			this.logger.info(
				'============== MANUTENCAO DE OFS - INICIO DO PROCESSO BUSCA ISOCRM =============='
			);

			const responseData = await VwFlowManutOfRepository.GetAll();

			if (
				typeof responseData != 'undefined' &&
				responseData != null &&
				responseData != '' &&
				responseData.length > 0
			) {
				for (const result of responseData) {
					const paramsValue = {
						tenantId: process.env.PROTHEUSVIVEO_RESTCREMER,
						branchId: result.FILIAL,
						orderId: result.Nro_Pedido_CRM,
						orderIdERP: result.OFNRO,
						resetPedidoIso: result.Voltar_Pedido_ISO,
						cancelPedido: result.Cancelar_pedido,
						sourceCrm: SystemasViveo.crmIso,
						aItemPedido: {
							Seq: result.Seq,
							FatPar: result.FatPar,
							CXFech: result.CXFech,
							Lote_unico: result.Lote_unico,
							Vcto_proximo: result.Vcto_proximo,
							Valor_tolerancia: result.Valor_tolerancia,
							Libera_abaixo_minimo: result.Libera_abaixo_minimo,
							Data_Previsao_fat: result.Data_Previsao_fat,
							Retido_Usuario: result.Retido_Usuario,
							Processado: result.Processado,
							DH_Processamento: result.DH_Processamento,
							Observacoes_NFE: result.Observacoes_NFE,
							Cancelar_pedido: result.Cancelar_pedido,
							Voltar_Pedido_ISO: result.Voltar_Pedido_ISO,
							ITEM_Seq: result.ITEM_Seq,
							ITEM_Seq_CRM: result.ITEM_Seq_CRM,
							ITEM_DataPrevFat: result.ITEM_DataPrevFat,
							ITEM_CancSaldo: result.ITEM_CancSaldo,
							Tipo_Triang: result.Tipo_Triang,
							Tab_Preco: result.Tab_Preco,
							CNPJ_Cliente: result.CNPJ_Cliente,
							Nro_Pedido_CRM: result.Nro_Pedido_CRM,
							ManOF_QuebraOF45M3:
								result.ManOF_QuebraOF45M3 == null
									? ''
									: result.ManOF_QuebraOF45M3.trim()
						}
					};

					loggerElastic(
						this.indexName,
						'200',
						this.originLayer,
						this.serviceName,
						JSON.stringify(paramsValue)
					);

					await this.broker.broadcast(
						'service.integration.order.updateOrderField',
						paramsValue
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
		}
	}
}
