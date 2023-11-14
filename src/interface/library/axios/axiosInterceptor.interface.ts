export interface IAxiosInterceptor {
	objtRequest: object;
}

export interface IGetTokenSalesForce {
	access_token: string;
	instance_url: string;
	id: string;
	token_type: string;
	issued_at: string;
	signature: string;
	message?: string;
}
