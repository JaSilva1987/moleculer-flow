export interface IOrderMessage {
	cEmpresa: string;
	cBranchId: string;
	cCondPagamento: string;
	cOrigem: string;
	cTipoPedido: string;
	cEstVirtual: string;
	cCodCliente: string;
	cLoja: string;
	cClienteEntrega: string;
	cLojaEntrega: string;
	cCondPagamentoCRM: string;
	cNumCRM: string;
	dDataCRM: string;
	dHoraCRM: string;
	cTransportadora: string;
	cTipoFrete: string;
	nFrete: number;
	cSeqEndEn: string;
	nMoeda: number;
	cNtEmpenho: string;
	cCodClieISO: number;
	dDtLibCred: string;
	dDtFaturamento: string;
	cLicitacao: string;
	cPortal: string;
	cIDPortal: string;
	cMsgNFE: string;
	cMsgExpedicao: string;
	cHrLibCred: string;
	cUserLibCred: string;
	cLoteUnico: string;
	TipoRemessa: string;
	cVencProx: string;
	cCaixaFechada: string;
	cFatParcial: string;
	cMesesVencProx: number;
	cCodBU: string;
	cPrioridadeCliente: string;
	nDiasAlocacaoFuturo: number;
	TotalLinhas: number;
	ValidaConversao: string;
	ValidaTotalLinhas: string;
	nM3Total: number;
	aPagamentos: APayments[];
	aItemPedido: APedidos[];
}

export interface APayments {
	cCodCTR: string;
	cPDV: string;
	cNSU: string;
	cNSUHost: string;
	cData: string;
	cHora: string;
	cCNPJ: string;
	nTaxa: number;
	nValor: number;
	nBandeira: number;
}

export interface APedidos {
	cProduto: string;
	cItemCRM: string;
	nQtdeVenda: number;
	nPrecoUnit: number;
	nValUnLista: number;
	nValorUnitLiquido: number;
	FatorConversao: number;
	FatorConversaoCaixa: number;
	UMOrigem: string;
	cUMComercial: string;
	cTpOperacao: string;
	cArmazem: string;
	cListaCome: string;
	nValUnCRM: number;
	nQtdeComercial: number;
	nValUnComercial: number;
	cItemPedCli: number;
	cNumPedCli: string;
	dDtFaturamentoItem: string;
	nValorIPI: number;
	nValorST: number;
	nValorICMS: number;
	nValorPIS: number;
	nValorCOFINS: number;
	nValorFCPS: number;
	nValorFCP: number;
	cExcluido: string;
	cOpLogistica: string;
	nValorUnitTotal: number;
	aLotePorItem: IItemsLot[];
	nM3Item: number;
}

export interface IPaymentsOrders {
	cCodCTR: string;
	cPDV: string;
	cNSU: string;
	cNSUHost: string;
	cData: string;
	cHora: string;
	cCNPJ: string;
	nTaxa: number;
	nValor: number;
	nBandeira: number;
}

export interface IItemsLot {
	cLote: string;
	dDtValidade: string;
	dDtFabricacao: string;
	nQuant: number;
}
