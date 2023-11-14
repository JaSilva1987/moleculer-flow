export interface IOrderConfirmation {
	site: string;
	codigoDepositante?: string;
	numeroPedido?: string;
	subPedido?: number;
	idIntegracao?: string;
	controller?: string;
}
export interface IIOrderConfirmation {
	status: number | string;
	message?: string;
}

export interface IOrderConfirmationData {
	site: string;
	numeroPedido: string;
	json?: string;
	status: string | number;
	createdAt?: Date;
	updatedAt?: Date;
}