export interface INewStock {
	site: string;
	usuario: string;
	codigoDepositante: string;
	codigoProduto?: string | null;
	statusDoEstoque?: string | null;
	motivoDoBloqueioDeQualidade?: string | null;
}
