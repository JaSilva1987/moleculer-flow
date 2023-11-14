import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { IUsersAuthentication } from '../../interface/integration/user/authenticationUsers.interface';

@Entity('authentication_users')
export class AuthenticationUsersEntity implements IUsersAuthentication {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	username: string;

	@Column()
	password: string;

	@Column()
	integration: string;

	@Column()
	lifetime: number;

	@Column()
	active: boolean;

	@Column()
	created_at?: Date;

	@Column()
	updated_at?: Date;
}
