export interface IOrdersBoxifarma {
	tenantId: string;
	branchId: string;
	CLIENTE: Cliente;
	PAGADOR: Pagador;
	RESIDENCIAL: Residencial;
	ORCAMENTO: Orcamento;
	PARCELAS: Parcelas;
	ITENS: Itens[];
}

export interface IIOrdersBoxifarma {
	tenantId: string;
	branchId: string;
	bodyData: object;
}

export interface INewOrdersBoxiFarma {
	CLIENTE: Cliente;
	PAGADOR: Pagador;
	RESIDENCIAL: Residencial;
	ORCAMENTO: Orcamento;
	PARCELAS: Parcelas;
	ITENS: Itens[];
}
export interface Cliente {
	A1_ZBX_CLI: string;
	A1_NOME: string;
	A1_NREDUZ: string;
	A1_PESSOA: string;
	A1_CGC: string;
	A1_END: string;
	A1_BAIRRO: string;
	A1_EST: string;
	A1_CEP: string;
	A1_COD_MUN: string;
	A1_PAIS: string;
	A1_TEL: string;
	A1_TIPO: string;
	A1_DDD: string;
	A1_CODPAIS: string;
	A1_EMAIL: string;
	A1_ZBX_DTC: string;
}
export interface Pagador {
	A1_ZBX_CLI: string;
	A1_ZBX_PAG: string;
	A1_NOME: string;
	A1_NREDUZ: string;
	A1_PESSOA: string;
	A1_CGC: string;
	A1_END: string;
	A1_BAIRRO: string;
	A1_EST: string;
	A1_CEP: string;
	A1_COD_MUN: string;
	A1_PAIS: string;
	A1_TEL: string;
	A1_TIPO: string;
	A1_DDD: string;
	A1_CODPAIS: string;
	A1_EMAIL: string;
	A1_ZBX_DTC: string;
}
export interface Residencial {
	A1_ZBX_CLI: string;
	A1_ZBX_RES: string;
	A1_NOME: string;
	A1_NREDUZ: string;
	A1_PESSOA: string;
	A1_CGC: string;
	A1_END: string;
	A1_BAIRRO: string;
	A1_EST: string;
	A1_CEP: string;
	A1_COD_MUN: string;
	A1_PAIS: string;
	A1_TEL: string;
	A1_TIPO: string;
	A1_DDD: string;
	A1_CODPAIS: string;
	A1_EMAIL: string;
	A1_ZBX_DTC: string;
}
export interface Orcamento {
	LQ_FILIAL: string;
	LQ_VEND: string;
	LQ_COMIS: number;
	LQ_CLIENTE: string;
	LQ_VLRTOT: number;
	LQ_DESCONT: number;
	LQ_VLRLIQ: number;
	LQ_NROPCLI: string;
	LQ_DTLIM: string;
	LQ_EMISSAO: string;
	LQ_HORA: string;
	LQ_DINHEIR: number;
	LQ_DESCFIN: number;
}
export interface Parcelas {
	L4_VALOR: number;
	L4_DATA: string;
	L4_FORMA: string;
	L4_MOEDA: string;
}
export interface Itens {
	LR_PRODUTO: string;
	LR_QUANT: number;
	LR_UNIT: number;
	LR_DESC: number;
	LR_VALDESC: number;
}
