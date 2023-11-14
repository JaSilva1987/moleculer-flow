export interface IOrderDispatch {
	site: string;
	codigoDepositante: string;
	numeroPedido: number;
	subPedido: number;
	codigoCliente?: string;
	numeroCarga?: number;
	notaFiscalVenda?: number;
	dataHoraExpedicao?: string;
}

export interface IOrderDispatchNotification {
	site: string;
	codigoDepositante: string;
	numeroPedido: string;
	subPedido: number;
	numeroCarga: string;
	idIntegracao?: string | null;
	controller: string;
}
