export interface IUnitProduct {
	OF: IOFUnitProduct;
}

export interface IOFUnitProduct {
	[x: string]: any;
	situacaoFinal: string;
	dtFaturamento?: string;
	status: string;
	mensagemFinal: string;
	items: IItemsUnitProduct[];
}

export interface IItemsUnitProduct {
	Produto: string;
	FatorConversao: string;
	UMOrigem: string;
	UMDestino: string;
	Situacao: string;
}

export interface IGetUnitProduct {
	Produtos: IGetProductUnitProduct[];
	DTFaturamento?: string;
	TenantId?: string;
	orderId?: string;
}

export interface IGetProductUnitProduct {
	Produto: string;
	UMOrigem: string;
	UMDestino: string;
	FatorConversao: number;
}
