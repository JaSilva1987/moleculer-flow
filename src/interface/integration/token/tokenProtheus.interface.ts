export interface ITokenProtheus {
	id?: number;
	urlHost: string;
	token: string;
	refreshToken: string;
	createdAt: Date;
	expireIn?: number;
}
