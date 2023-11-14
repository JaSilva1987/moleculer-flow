export interface IItemPedido {
	cItemOF?: string;
	dDtFaturamentoItem?: string;
	cCancelaItem?: string;
	cItemCRM?: string;
	nQtdItem?: number;
}

export interface IUpdateOrderField {
	cNumOF?: string;
	dDtFaturamento?: string;
	cMsgNFE?: string;
	cLoteUnico?: string;
	cVencProx?: string;
	cCaixaFechada?: string;
	cFatParcial?: string;
	cMesesVencProx?: string;
	cLiberaValMin?: string;
	nValTolerancia?: number;
	cTipoCancelamento?: string;
	aItemPedido?: IItemPedido[];
	ManOF_QuebraOF45M3?: string;
}

export interface IBodyOF {
	OF?: IUpdateOrderField[];
}
