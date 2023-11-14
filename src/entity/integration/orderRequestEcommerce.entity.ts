import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { IOrderRequestEcommerceIntegration } from '../../interface/integration/order/orderRequestEcommerce.interface';
import { IEcommerceProductIntegration } from '../../interface/integration/product/EcommerceProduct.interface';

@Entity('integracao_ecommerce_orderrequest')
export class EcommerceOrderRequestEntity
	implements IOrderRequestEcommerceIntegration
{
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	idOrder: string;

	@Column()
	statusOrder: string;

	@Column()
	JSON: string;

	@Column()
	status: string;

	@Column()
	createdAt?: Date;

	@Column()
	updatedAt?: Date;

	@Column()
	JSONRetorno: string;
}
