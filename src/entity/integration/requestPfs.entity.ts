import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { IRequestPfsIntegration } from '../../interface/integration/request/requestPfs.interface';

@Entity('integracao_pfs_request')
export class RequestPfsEntity implements IRequestPfsIntegration {
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
