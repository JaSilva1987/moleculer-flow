import axios, { AxiosError, AxiosRequestConfig } from 'axios';
import https from 'https';
import { Errors } from 'moleculer';
import { IAxiosResponse } from '../../../src/interface/library/axios';

export async function AxiosRequestComplete(
	urlSend: string,
	bodySend: any,
	nameToken: string,
	generateToken: string,
	methodAxios: 'get' | 'post' | 'put',
	paramName?: string,
	paramsValue?: string,
	routineName?: string,
	multipleHeaders?: object | null,
	multipleParams?: object | null
): Promise<IAxiosResponse> {
	try {
		let statusCode, sendAxios;
		if (!paramName && !paramsValue) {
			paramName = null;
			paramsValue = null;
		}

		await axios
			.request({
				method: methodAxios,
				url: urlSend,
				data: bodySend,
				headers: {
					[process.env.CONTENT_TYPE_NAME]: process.env.CONTENT_TYPE,
					[nameToken]: generateToken,
					[paramName]: paramsValue,
					...multipleHeaders
				},
				params: {
					...multipleParams
				}
			})
			.then((res) => {
				statusCode = res.status;
				if (res.data?.data?.[routineName]) {
					sendAxios = {
						status: res.status,
						message: res.data?.data?.[routineName]
					};
				} else if (res.data?.[routineName]) {
					sendAxios = {
						status: res.status,
						message: res.data?.[routineName]
					};
				} else {
					sendAxios = {
						status: res.status,
						message: res.data
					};
				}
			})
			.catch(function (error) {
				if (error.response) {
					statusCode = error?.response?.status || 401;
					sendAxios = {
						status: statusCode,
						message: error.response.data
					};
				} else {
					statusCode = error?.response?.status || 401;
					sendAxios = { status: statusCode, message: error.message };
				}
				//sendAxios = error;
			});

		return sendAxios;
	} catch (err) {
		throw new Errors.MoleculerError(err, 500);
	}
}

export async function AxiosRequestSimple(
	urlSend: string,
	methodAxios: 'get' | 'post' | 'put'
): Promise<IAxiosResponse> {
	try {
		let statusCode, sendAxios;

		await axios
			.request({
				method: methodAxios,
				url: urlSend,
				headers: {
					[process.env.CONTENT_TYPE_NAME]: process.env.CONTENT_TYPE
				}
			})
			.then((res) => {
				statusCode = res.status;
				sendAxios = { status: res.status, message: res.data };
			})
			.catch(function (error) {
				statusCode =
					error.code === undefined || 'undefined'
						? '401'
						: error.code;
				sendAxios = { status: statusCode, message: error };
				//sendAxios = error;
			});

		return sendAxios;
	} catch (error) {
		//throw new Errors.MoleculerError(error.message, 500);
		console.error(
			'====== CATCH LIBRARY AXIOS SIMPLE ERROR =====\n' +
				JSON.stringify(error)
		);
	}
}

export async function AxiosRequestWithOutAuth(
	urlSend: string,
	bodySend: any,
	methodAxios: 'get' | 'post' | 'put',
	multipleHeaders?: object | null,
	multipleParams?: object | null
): Promise<IAxiosResponse> {
	try {
		let statusCode, sendAxios;

		await axios
			.request({
				method: methodAxios,
				url: urlSend,
				data: bodySend,
				headers: {
					...multipleHeaders
				},
				params: {
					...multipleParams
				},
				httpsAgent: new https.Agent({
					rejectUnauthorized: false
				})
			})
			.then((res) => {
				statusCode = res.status;
				sendAxios = {
					status: res.status,
					message: res.data
				};
			})
			.catch(function (error) {
				statusCode =
					error.code === undefined || 'undefined'
						? error.response.status
							? error.response.status
							: '401'
						: error.code;
				sendAxios = { status: statusCode, message: error };
				//sendAxios = error;
			});

		return sendAxios;
	} catch (err) {
		throw new Errors.MoleculerError(err.message, 500);
	}
}

export async function AxiosRequestType(
	urlSend: string,
	bodySend: any,
	methodAxios: 'get' | 'post' | 'put' | 'patch',
	multipleHeaders?: object | null,
	multipleParams?: object | null
): Promise<any> {
	try {
		let statusCode, sendAxios;
		await axios
			.request({
				method: methodAxios,
				url: urlSend,
				data: bodySend,
				headers: {
					[process.env.CONTENT_TYPE_NAME]: process.env.CONTENT_TYPE,
					...multipleHeaders
				},
				params: multipleParams
			})
			.then((res) => {
				sendAxios = {
					status: res.status,
					message: res.data
				};
			})
			.catch(function (error) {
				if (error.response) {
					statusCode =
						typeof error.code === 'undefined' ? '401' : error.code;
					sendAxios = {
						status: statusCode,
						message: error.response.data
					};
				} else {
					statusCode =
						typeof error.code === 'undefined' ? '401' : error.code;
					sendAxios = { status: statusCode, message: error.message };
				}
				//sendAxios = error;
			});
		return sendAxios;
	} catch (err) {
		throw new Errors.MoleculerError(err, 500);
	}
}

export async function AxiosRequest(
	confRequest: object
): Promise<IAxiosResponse> {
	try {
		let statusCode, sendAxios;

		await axios(confRequest)
			.then(function (res) {
				statusCode = res.status;
				sendAxios = { status: res.status, message: res.data };
			})
			.catch(function (error) {
				statusCode =
					error.code === undefined || 'undefined'
						? '401'
						: error.code;
				sendAxios = { status: statusCode, message: error };
			});

		return sendAxios;
	} catch (err) {
		throw new Errors.MoleculerError(err.message, 500);
	}
}

export async function simpleRequest(
	url: string,
	method: 'get' | 'post' | 'put' | 'patch',
	headers?: any,
	body?: JSON
): Promise<IAxiosResponse> {
	try {
		const requestObject: AxiosRequestConfig = {
			url: url,
			method: method,
			headers: headers,
			data: body
		};
		const axiosIstance = axios.create();
		const request = await axiosIstance.request(requestObject);
		if (request.status < 200 || request.status >= 300) {
			throw request;
		}

		const responseAxios: IAxiosResponse = {
			status: request.status,
			message: request.data
		};
		return responseAxios;
	} catch (error: AxiosError | unknown) {
		const errorObject: IAxiosResponse = {
			message: error as unknown as keyof IAxiosResponse,

			status: 500
		};

		if (axios.isAxiosError(error)) {
			errorObject.status = error?.response?.status || 500;
			errorObject.message = error?.response.data || 'Unknown Error';
		}
		return errorObject;
	}
}
