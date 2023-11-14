export interface IGenerateServiceOauth2 {
	tenant: string;
	serviceAccount: string;
	account: string;
	basePath: string;
	cert: string;
	iss: string;
	params: string;
	grantType: string;
}

export interface IGenerateToken {
	access_token: string;
	expires_in: number;
	token_type: string;
}

export interface IReturnToken {
	status: number;
	message: IGenerateToken;
}
