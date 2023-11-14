export interface IOrderCancellationRequest {
	site: string;
	codigoDepositante: string;
	numeroPedido: string;
	subPedido: number;
	motivoCancelamento?: string | null;
}
