import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { IStockPfsIntegration } from '../../interface/integration/stock/stockPfs.interface';

@Entity('integracao_pfs_stock')
export class StockPfsEntity implements IStockPfsIntegration {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	codigoEan: string;

	@Column()
	armazen: string;

	@Column()
	JSON: string;

	@Column()
	status: string;

	@Column()
	createdAt?: Date;

	@Column()
	updatedAt?: Date;
}
