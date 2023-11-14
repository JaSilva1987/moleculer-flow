export interface ITokenOuro {
	token_type?: string;
	expires_in?: number;
	access_token?: string;
}
export interface IITokenOuro {
	message?: ITokenOuro;
}
