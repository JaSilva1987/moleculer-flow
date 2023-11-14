import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { IStockEcommerceIntegration } from '../../interface/integration/stock/stockEcommerce.interface';

@Entity('integracao_ecommerce_stockproducts')
export class StockEcommerceEntity implements IStockEcommerceIntegration {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	productId: string;

	@Column()
	quantity: number;

	@Column()
	createdAt?: Date;

	@Column()
	updatedAt?: Date;
}
