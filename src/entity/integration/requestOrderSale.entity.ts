import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { IRequestOrderSalePfsIntegration } from '../../interface/integration/request/requestOrderSalePfs.interface';

@Entity('integracao_pfs_requestordersale')
export class RequestOrderSalePfsEntity
	implements IRequestOrderSalePfsIntegration
{
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	cliente: string;

	@Column()
	num_pedido: string;

	@Column()
	JSON: string;

	@Column()
	status: string;

	@Column()
	createdAt?: Date;

	@Column()
	updatedAt?: Date;
}
