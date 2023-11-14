export interface IReceiptCancellation {
	site: string;
	codigoDepositante: string;
	numeroNotaFiscal: number;
	serieNotaFiscal: string;
	idIntegracao?: string | null;
	controller: string;
}
