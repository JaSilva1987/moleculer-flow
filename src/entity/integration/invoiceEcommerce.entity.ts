import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { IDataInvoiceOrder } from '../../interface/integration/invoice/invoice.interface';

@Entity('integracao_ecommerce_invoicesend')
export class EcommerceInvoiceEntity implements IDataInvoiceOrder {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	idOrder: string;

	@Column()
	numberInvoice: string;

	@Column()
	JSON: string;

	@Column()
	status: string;

	@Column()
	createdAt?: Date;

	@Column()
	updatedAt?: Date;
}
