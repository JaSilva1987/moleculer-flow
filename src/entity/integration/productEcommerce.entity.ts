import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { IEcommerceProductIntegration } from '../../interface/integration/product/EcommerceProduct.interface';

@Entity('integracao_ecommerce_products')
export class EcommerceProductsEntity implements IEcommerceProductIntegration {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	productId: string;

	@Column()
	productSku: string;

	@Column()
	nameProduct: string;

	@Column()
	JSON: string;

	@Column()
	status: string;

	@Column()
	createdAt?: Date;

	@Column()
	updatedAt?: Date;

	@Column('decimal', { precision: 10, scale: 2 })
	IPI?: number;

	@Column()
	originProduct?: string;
}
