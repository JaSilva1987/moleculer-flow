import { ViewColumn, ViewEntity } from 'typeorm';

@ViewEntity({
	name: 'VWFlowISOPedidoItens',
	expression: `SELECT * FROM VWFlowISOPedidoItens`
})
export class VWFlowISOPedidoItensEntity {
	@ViewColumn() ISOEmp_Codigo: number;

	@ViewColumn() ISOPvPed_Codigo: number;

	@ViewColumn() ISOPvPed_CliCodigo: number;

	@ViewColumn() CLIENTE_BU: string;

	@ViewColumn() ISOPvPed_CliCXFec: string;

	@ViewColumn() ISOPvPed_CliFatParc: string;

	@ViewColumn() ISOPvPed_CliLotUni: string;

	@ViewColumn() ISOPvPed_CliVctPrx: string;

	@ViewColumn() IsoPvPed_CliMesVctPrx: number;

	@ViewColumn() ISOPvPed_CliTG: string;

	@ViewColumn() ISOPvPed_LOJTG: string;

	@ViewColumn() ISOPVPed_CLIPRIORIDADE: string;

	@ViewColumn() ISOPvPed_CLIDIASALOCFUT: number;

	@ViewColumn() ISOPvPed_DtaPedido: Date;

	@ViewColumn() ISOPvPed_HoraPedido: string;

	@ViewColumn() ISOPeCntPgt_Forma: string;

	@ViewColumn() ISOPvPed_Pagamento: string;

	@ViewColumn() ISOPvPed_DtaPrevFat: Date;

	@ViewColumn() ISOPvPed_CodEndEntrega: number;

	@ViewColumn() ISOPvPedOri_Codigo: string;

	@ViewColumn() IsoPVPed_LICITA: string;

	@ViewColumn() IsoPVPed_PORTAL: string;

	@ViewColumn() IsoPVPed_IDPORT: string;

	@ViewColumn() ISOPvPedTip_Codigo: string;

	@ViewColumn() ISOPvPed_CodEndCobranca: number;

	@ViewColumn() ISOPvPed_ValorTotalPedido: number;

	@ViewColumn() ISOPvPedIte_Codigo: number;

	@ViewColumn() ISOPrd_Codigo: string;

	@ViewColumn() Item_Quantidade: number;

	@ViewColumn() ISOPvPedIte_DataPromessa: Date;

	@ViewColumn() ISOPvPedIte_DtaSolEntrega: Date;

	@ViewColumn() ISOPvPedIte_UnidadeOrigem: string;

	@ViewColumn() Item_QTD_UnidadeDestino: string;

	@ViewColumn() ISOPrdUndFatC_FatorConversao: number;

	@ViewColumn() ISOPrdUndFatC_FatorConversaoCX: number;

	@ViewColumn() ISOPvPedIte_Qtd_UM_estoque: number;

	@ViewColumn() ISOPvPedIte_Vlr_Total_Unitario: number;

	@ViewColumn() ISOPvPedIte_Vlr_Total_Unitario_EST: number;

	@ViewColumn() ISOPvPedIteSit_Codigo: number;

	@ViewColumn() ISOPvPedIte_AgendamentoData: Date;

	@ViewColumn() ISOPvPedIte_AgendamentoHoraIni: Date;

	@ViewColumn() ISOPvPedIte_AgendamentoHoraFin: Date;

	@ViewColumn() ISOPvPedIte_ValorEmpenho: number;

	@ViewColumn() ISOPvPed_ValorFrete: number;

	@ViewColumn() ISOEmpEnt_CliCod_ERP: string;

	@ViewColumn() ISOEmpEnt_Ori_LX: string;

	@ViewColumn() ISOPvPedIte_Armazem: string;

	@ViewColumn() ISOEntCli_Operacao: string;

	@ViewColumn() ISOPvCD_Estabelecimento_LX: number;

	@ViewColumn() ISOPvPed_CodigoAtendente: number;

	@ViewColumn() ISOEnt_NomeAtendente: string;

	@ViewColumn() ISOWFTrf_DataLiberacaoCredito: string;

	@ViewColumn() ISOWFTrf_HoraLiberacaoCredito: string;

	@ViewColumn() ISOWFTrf_CodigoAtendente: string;

	@ViewColumn() ISOMoe_Codigo: number;

	@ViewColumn() ISOPvPedIte_ValorIPI: number;

	@ViewColumn() ISOPvPedIte_VlrSubsTrib: number;

	@ViewColumn() ISOPvPedIte_ValorICMS: number;

	@ViewColumn() ISOPvPedIte_ValorPIS: number;

	@ViewColumn() ISOPvPedIte_ValorCofins: number;

	@ViewColumn() ISOPVPedIte_ValorFCPST: number;

	@ViewColumn() ISOPvPedIte_ValorFCP: number;

	@ViewColumn() ISOPvPedido_CodigoTRP: string;

	@ViewColumn() ISOPvPedidoTipoFrete: string;

	@ViewColumn() ISOEmpEnt_Tabela_Preco: string;

	@ViewColumn() ISOPvPedIte_PrecoLista: number;

	@ViewColumn() ISOPVPed_OrdCompra: string;

	@ViewColumn() ISOPvPedIte_NrOrdemCompra: string;

	@ViewColumn() ISOPvPedIte_LinhaOrdemCompra: number;

	@ViewColumn() ISOPvPed_Operacao: string;

	@ViewColumn() ISOPvPedIte_PrecoCMLIntegracaoBO: number;

	@ViewColumn() ISOPvPedIte_PrecoUNESTIntegracaoBO: number;

	@ViewColumn() ISOPvPedido_NumeroEmpenho: string;

	@ViewColumn() ISOPvPedIte_TotalLinhas: number;

	@ViewColumn() ISOPvPedIte_Lote1: string;

	@ViewColumn() ISOPvPedIte_QtdeLote1: number;

	@ViewColumn() ISOPvPedIte_Lote2: string;

	@ViewColumn() ISOPvPedIte_QtdeLote2: number;

	@ViewColumn() ISOPvPedIte_Lote3: string;

	@ViewColumn() ISOPvPedIte_QtdeLote3: number;

	@ViewColumn() ISOPvPedIte_Lote4: string;

	@ViewColumn() ISOPvPedIte_QtdeLote4: number;

	@ViewColumn() ISOPvPedIte_Lote5: string;

	@ViewColumn() ISOPvPedIte_QtdeLote5: number;

	@ViewColumn() Vlr_unit_LIQUIDO: number;

	@ViewColumn() OBSERVACAO_NF: string;

	@ViewColumn() OBSERVACAO_TRACKING: string;

	@ViewColumn() ISOEmpEnt_CliCod_ERP_CODIGO: string;

	@ViewColumn() ISOEmpEnt_CliCod_ERP_Loja: string;
}
