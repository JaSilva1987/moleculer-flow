import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import https from 'https';
import {
	AxiosRequest,
	AxiosRequestComplete,
	AxiosRequestSimple,
	AxiosRequestType,
	AxiosRequestWithOutAuth,
	simpleRequest
} from '../../../services/library/axios/axiosRequest';

interface IAxiosResponse {
	status: number;
	message: any;
}

describe('::Testes ::AxiosRequest', () => {
	it('deve chamar axios com as configurações corretas e retornar uma resposta bem-sucedida', async () => {
		const axiosMock = jest.spyOn(axios, 'request');
		axiosMock.mockResolvedValue({
			status: 200,
			data: { message: 'Resposta bem-sucedida' }
		});

		const requestConfig = {
			method: 'get',
			url: 'https://example.com',
			headers: { 'Content-Type': 'application/json' }
		};

		const result: IAxiosResponse = await AxiosRequest(requestConfig);

		expect(result.status).toEqual(200);
		expect(result).toBeDefined();

		axiosMock.mockRestore();
	});

	it('deve chamar axios e lidar com uma falha de solicitação', async () => {
		const axiosMock = jest.spyOn(axios, 'request');
		axiosMock.mockRejectedValue({
			response: { status: 401, data: 'Não Autorizado' }
		});

		const requestConfig = {
			method: 'post',
			url: 'https://example.com/1',
			headers: { 'Content-Type': 'application/json' }
		};

		const result: IAxiosResponse = await AxiosRequest(requestConfig);

		expect(result.status).toEqual('401');
		expect(result).toBeDefined();

		axiosMock.mockRestore();
	});
});

describe('::Testes ::simpleRequest', () => {
	it('deve chamar axios com as configurações corretas e retornar uma resposta bem-sucedida', async () => {
		const axiosMock = jest.spyOn(axios, 'request');
		axiosMock.mockResolvedValue({
			status: 200,
			data: { message: 'Resposta bem-sucedida' }
		});

		const result: IAxiosResponse = await simpleRequest(
			'https://example.com',
			'get',
			{ 'Content-Type': 'application/json' }
		);
		expect(result.status).toEqual(200);
		expect(result).toBeDefined();

		axiosMock.mockRestore();
	});

	it('deve chamar axios e lidar com uma falha de solicitação', async () => {
		const axiosMock = jest.spyOn(axios, 'request');
		axiosMock.mockRejectedValue({
			response: { status: 404, data: 'Não Autorizado' }
		});

		const result: IAxiosResponse = await simpleRequest(
			'https://example.com/1',
			'get',
			{ 'Content-Type': 'application/json' }
		);

		expect(result.status).toEqual(404);
		expect(result).toBeDefined();

		axiosMock.mockRestore();
	});
});

describe('::Testes ::AxiosRequestType', () => {
	it('deve chamar axios com as configurações corretas e retornar uma resposta bem-sucedida', async () => {
		const axiosMock = jest.spyOn(axios, 'request');
		axiosMock.mockResolvedValue({
			status: 200,
			data: { message: 'Resposta bem-sucedida' }
		});

		const result: IAxiosResponse = await AxiosRequestType(
			'https://example.com',
			'',
			'get',
			{ 'Content-Type': 'application/json' }
		);
		expect(result.status).toEqual(200);
		expect(result).toBeDefined();

		axiosMock.mockRestore();
	});

	it('deve chamar axios e lidar com uma falha de solicitação', async () => {
		const axiosMock = jest.spyOn(axios, 'request');
		axiosMock.mockRejectedValue({
			response: { status: 404, data: 'Não Autorizado' }
		});

		const result: IAxiosResponse = await AxiosRequestType(
			'https://example.com',
			'',
			'get',
			{ 'Content-Type': 'application/json' }
		);

		expect(result.status).toEqual('401');
		expect(result).toBeDefined();

		axiosMock.mockRestore();
	});
});

describe('::Testes ::AxiosRequestWithOutAuth', () => {
	it('deve chamar axios com as configurações corretas e retornar uma resposta bem-sucedida', async () => {
		const axiosMock = jest.spyOn(axios, 'request');
		axiosMock.mockResolvedValue({
			status: 200,
			data: { message: 'Resposta bem-sucedida' }
		});

		const result: IAxiosResponse = await AxiosRequestWithOutAuth(
			'https://example.com',
			'',
			'get',
			{ 'Content-Type': 'application/json' }
		);
		expect(result.status).toEqual(200);
		expect(result).toBeDefined();

		axiosMock.mockRestore();
	});

	it('deve chamar axios e lidar com uma falha de solicitação', async () => {
		const axiosMock = jest.spyOn(axios, 'request');
		axiosMock.mockRejectedValue({
			response: { status: 404, data: 'Não Autorizado' }
		});

		const result: IAxiosResponse = await AxiosRequestWithOutAuth(
			'https://example.com',
			'',
			'get',
			{ 'Content-Type': 'application/json' }
		);

		expect(result.status).toEqual(404);
		expect(result).toBeDefined();

		axiosMock.mockRestore();
	});
});

describe('::Testes ::AxiosRequestSimple', () => {
	it('deve chamar axios com as configurações corretas e retornar uma resposta bem-sucedida', async () => {
		const axiosMock = jest.spyOn(axios, 'request');
		axiosMock.mockResolvedValue({
			status: 200,
			data: { message: 'Resposta bem-sucedida' }
		});

		const result: IAxiosResponse = await AxiosRequestSimple(
			'https://example.com',
			'get'
		);
		expect(result.status).toEqual(200);
		expect(result).toBeDefined();

		axiosMock.mockRestore();
	});

	it('deve chamar axios e lidar com uma falha de solicitação', async () => {
		const axiosMock = jest.spyOn(axios, 'request');
		axiosMock.mockRejectedValue({
			response: { status: 404, data: 'Não Autorizado' }
		});

		const result: IAxiosResponse = await AxiosRequestSimple(
			'https://example.com',
			'get'
		);

		expect(result.status).toEqual('401');
		expect(result).toBeDefined();

		axiosMock.mockRestore();
	});
});

describe('::Testes ::AxiosRequestComplete', () => {
	it('deve chamar axios com as configurações corretas e retornar uma resposta bem-sucedida', async () => {
		const axiosMock = jest.spyOn(axios, 'request');
		axiosMock.mockResolvedValue({
			status: 200,
			data: { message: 'Resposta bem-sucedida' }
		});

		const result: IAxiosResponse = await AxiosRequestComplete(
			'https://example.com',
			'',
			'Authorization',
			'token',
			'get'
		);
		expect(result.status).toEqual(200);
		expect(result).toBeDefined();

		axiosMock.mockRestore();
	});

	it('deve chamar axios e lidar com uma falha de solicitação', async () => {
		const axiosMock = jest.spyOn(axios, 'request');
		axiosMock.mockRejectedValue({
			response: { status: 404, data: 'Não Autorizado' }
		});

		const result: IAxiosResponse = await AxiosRequestComplete(
			'https://example.com',
			'',
			'Authorization',
			'token',
			'get'
		);

		expect(result.status).toEqual(404);
		expect(result).toBeDefined();

		axiosMock.mockRestore();
	});
});
