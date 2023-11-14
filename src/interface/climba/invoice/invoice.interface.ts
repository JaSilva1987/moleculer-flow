import { IDataInvoiceOrder } from '../../integration/invoice/invoice.interface';

export interface IInvoiceOrder {
	number: string;
	nfeAccessKey: string;
	logisticOperatorId: string;
	xml: string;
	volumes: string;
}

export interface ISendInvoiceOrder {
	jsonInvoice: IInvoiceOrder;
	dataInvoice: IDataInvoiceOrder;
}
