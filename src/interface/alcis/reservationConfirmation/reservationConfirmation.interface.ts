export interface IReservationConfirmation {
	site: string;
	codigoDepositante?: string;
	numeroPedido?: string;
	subPedido?: number;
	idIntegracao?: string;
	controller?: string;
}

export interface IIReservationConfirmation {
	status: number | string;
	message?: string;
}

export interface IIIReservationConfirmation {
	site: string;
	numeroPedido: string;
	json?: string;
	status: string | number;
	createdAt?: Date;
	updatedAt?: Date;
}

export interface IReservationConfirmationProtheus {
	site: string;
	codigoDepositante: string;
	numeroPedido: string;
	subPedido: number;
	idIntegracao: string;
	controller: string;
	status: string | number;
	mensagem: string
}
