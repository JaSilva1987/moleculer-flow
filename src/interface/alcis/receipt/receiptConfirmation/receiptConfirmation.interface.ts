export interface IReceiptReceivedConfirmation {
	site: string;
	numeroDoRecebimento: number | string;
	idIntegracao?: string | null;
	controller: string;
}

export interface IIReceiptReceivedConfirmation {
	status: number | string;
	message?: string;
}


export interface IReceiptReceivedConfirmationData {
	site: string;
	numeroDoRecebimento: string | number;
	json?: string;
	status: string | number;
	createdAt?: Date;
	updatedAt?: Date;
}