export interface IAxiosRequest {
	urlSend?: string;
	urlToken?: string;
	methodSend: string;
	bodySend: string;
	acessToken: string;
	sendAxios: string;
	statusCode: string;
	status: number;
}

export interface IAxiosResponse {
	status: number;
	message: string;
}
