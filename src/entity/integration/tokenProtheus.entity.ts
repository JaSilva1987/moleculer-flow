import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { ITokenProtheus } from '../../interface/integration/token/tokenProtheus.interface';

@Entity('integracao_tokens')
export class TokenProtheusEntity implements ITokenProtheus {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	urlHost: string;

	@Column()
	token: string;

	@Column()
	refreshToken: string;

	@Column()
	createdAt: Date;

	@Column()
	expireIn?: number;
}
