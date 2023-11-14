export interface IPaymentCrmIso {
	ZPT110_ZPT_FILIAL: number;
	ZPT110_ZPT_NUM: number;
	ZPT110_ZPT_SEQ: number;
	ZPT110_ZPT_CODCTR: string;
	ZPT110_ZPT_TAXA: number;
	ZPT110_ZPT_VALOR: number;
	ZPT110_ZPT_PDV: string;
	ZPT110_ZPT_NSU: string;
	ZPT110_ZPT_NSUHST: string;
	ZPT110_ZPT_BANDEI: number;
	ZPT110_ZPT_DATA: string;
	ZPT110_ZPT_HORA: string;
	ZPT110_ZPT_CNPJC: string;
}

export interface IVPaymentCrmIso {
	updatePayment: IIPaymentCrmIso;
	tenantId: string;
	branchId: string;
	orderId: string;
	orderIdERP: string;
}

export interface IIPaymentCrmIso {
	OF: Of[];
}

export interface Of {
	cNumOF: string;
	dDtFaturamento: string;
	cMsgNFE: string;
	cLoteUnico: string;
	cVencProx: string;
	cCaixaFechada: string;
	cFatParcial: string;
	cMesesVencProx: number;
	cLiberaValMin?: string;
	nValTolerancia?: number;
	cTipoCancelamento: string;
	aPagamentos: APagamento[];
}

export interface APagamento {
	nSeq: number;
	cPDV: string;
	cCodCTR: string;
	cNSUHost: string;
	nValor: number;
	nTaxa: number;
	cNSU: string;
	nBandeira: number;
	cData: string;
	cHora: string;
	cCNPJ: string;
}

export interface IIIPaymentsOrders {
	cNumPed: string;
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

export interface OfPayemnt {
	cNumOF: string;
	lPagamento?: boolean;
	dDtFaturamento?: string;
	cMsgNFE?: string;
	cLoteUnico?: string;
	cVencProx?: string;
	cCaixaFechada?: string;
	cFatParcial?: string;
	cMesesVencProx?: number;
	cLiberaValMin?: string;
	nValTolerancia?: number;
	cTipoCancelamento?: string;
	aPagamentos: APagamento[];
	aItemPedido: IAItemPedido[];
}

export interface IAItemPedido {
	cItemOF: string;
}
