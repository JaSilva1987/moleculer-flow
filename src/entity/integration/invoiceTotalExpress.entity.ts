import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { IDataInvoiceTotalExpress } from '../../interface/integration/invoice/invoiceTotalExpress.interface';

@Entity('totalexpress_invoice')
export class InvoiceTotalExpressEntity implements IDataInvoiceTotalExpress {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	invoiceNumber: string;

	@Column()
	JSON: string;

	@Column()
	status: string;

	@Column()
	createdAt?: Date;

	@Column()
	updatedAt?: Date;
}
