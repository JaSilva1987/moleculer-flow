export interface INewOrderItems {
	numeroItem: number;
	codigoProduto: string;
	quantidade: number;
	valorUnitario?: number;
	moeda?: string;
	unidade: string;
	lote?: string;
	loteSerial?: string;
	dataDeProducao?: string;
	dataDeValidade?: string;
	statusDoEstoque: string;
	motivoDoBloqueioDeQualidade?: string;
}
