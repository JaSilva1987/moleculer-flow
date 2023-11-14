import { IReceiveReceiptItems } from './items.interface';

export interface INewReceipt {
	site: string;
	codigoDepositante: string;
	numeroNotaFiscal: string;
	serieNotaFiscal: string;
	dataNotaFiscal: string;
	codigoFornecedor: string;
	tipoDocumento?: string | null;
	codigoDocumento?: string | null;
	codigoTransportadora: string;
	idIntegracao?: string | null;
	agrupadorRecebimento?: string | null;
	deposito?: string | null;
	area?: string | null;
	endereco?: string | null;
	tipoDeRecebimento: string;
	placaDoVeiculo?: string | null;
	itens: IReceiveReceiptItems[];
}

export interface INotificationNewReceiptNF {
	site: string;
	numeroDoRecebimento: number;
	idIntegracao?: string | null;
	controller: string;
}
