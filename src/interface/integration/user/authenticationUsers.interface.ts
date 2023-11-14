export interface IUsersAuthentication {
	username: string;
	password: string;
	integration: string;
	lifetime: number;
	active: boolean;
	created_at?: Date;
	updated_at?: Date;
}
