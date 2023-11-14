export interface IOrderInvoice {
	site: string;
	codigoDepositante: string;
	numeroPedido: string;
	subPedido: number;
	numeroNotaFiscal: string;
	dataNotaFiscal?: string | null;
	valorTotal?: number | null;
}
