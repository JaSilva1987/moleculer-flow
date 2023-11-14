export interface IGetInventoryAdjust {
	site: string;
	usuario: string;
	codigoDepositante: string;
	codigoProduto?: string | null;
	statusDoEstoque?: string | null;
	motivoDoBloqueioDeQualidade?: string | null;
}

export interface IInventoryAdjust {
	site: string;
	numeroDaTransacao: number;
	controller: string;
}
