export interface IOrderStatus {
	site: string;
	codigoDepositante: string;
	numeroPedido: string;
	subPedido: number;
	idIntegracao?: string | null;
	statusAnterior: string;
	descricaoStatusAnterior: string;
	statusAtual: string;
	descricaoStatusAtual: string;
	controller: string;
}
