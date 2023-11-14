import { IInvoiceTotalExpress } from '../../totalExpress/invoice.interface';

export interface IDataInvoiceTotalExpress {
	id?: number;
	invoiceNumber: string;
	JSON: string;
	status: string;
	createdAt?: Date;
	updatedAt?: Date;
}

export interface ISendInvoiceTotalExpress {
	jsonInvoice: IInvoiceTotalExpress;
	dataInvoice: IDataInvoiceTotalExpress;
}
