import { IOrderRequestEcommerceIntegration } from './orderRequestEcommerce.interface';

export interface IGenerateOrders {
	OF: IOF[];
}

export interface IOF {
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
	cRedespXML?: string;
	cFatAutomatico?: string;
	cVendedor?: string;
	cEstrutCom?: string;
	cUsrCRM?: string;
	cOperMafra?: string;
	cNicho?: string;
	cSubNicho?: string;
	cHoraIntegracao?: string;
	aPagamentos: IAPagamento[];
	aItemPedido: IAItemPedido[];
	cStatus?: string;
	cGrupoTrib?: string;
	lPagamento?: boolean;
	cDesconto?: number;
}

export interface IAItemPedido {
	cProduto: string;
	cItemCRM: string;
	nQtdeVenda: number;
	nPrecoUnit: string;
	nValUnLista: string;
	nValorUnitLiquido: string;
	FatorConversao: number;
	FatorConversaoCaixa: number;
	UMOrigem: string;
	cUMComercial: string;
	cTpOperacao: string;
	cArmazem: string;
	cListaCome: string;
	nValUnCRM: number;
	nQtdeComercial: number;
	nValUnComercial: string;
	cItemPedCli: number;
	cNumPedCli: string;
	dDtFaturamentoItem: string;
	nValorIPI: string;
	nValorST: number;
	nValorICMS: number;
	nValorPIS: number;
	nValorCOFINS: number;
	nValorFCPS: number;
	nValorFCP: number;
	cExcluido: string;
	cOpLogistica: string;
	nValorUnitTotal: string;
	cOperMafra?: string;
	aLotePorItem: IALotePorItem[];
	nM3Item: number;
	nQtdeEntregue?: number;
}

export interface IALotePorItem {
	cLote: string;
	dDtValidade: string;
	dDtFabricacao: string;
	nQuant: number;
}

export interface IAPagamento {
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

export interface IGenerateSend {
	jsonPost: IGenerateOrders;
	tenantId: string;
	dataOrder?: IOrderRequestEcommerceIntegration;
}
