export interface IOrderCancellation {
	site: string;
	codigoDepositante: string;
	numeroPedido: string;
	subPedido: number;
	idIntegracao?: string | null;
	controller: string;
}
