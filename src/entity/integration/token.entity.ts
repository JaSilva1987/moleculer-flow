import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { IGetTokenTable } from '../../interface/integration/token/getToken.interface';

@Entity('token_controller')
export class TokenEntity implements IGetTokenTable {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	token: string;

	@Column()
	tokenSystem: string;

	@Column()
	statusToken: 200 | 400;

	@Column()
	createdAt: Date;

	@Column()
	updatedAt?: Date;

	@Column()
	lifeTime?: string;
}
