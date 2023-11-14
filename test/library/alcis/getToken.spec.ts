import axios from 'axios';
import { getToken } from '../../../services/library/alcis/getToken';

// Mock axios para simular a chamada da API
jest.mock('axios');

declare module 'axios' {
	export function post<T = any, R = AxiosResponse<T, any>, D = any>(
		url: string,
		data?: D,
		config?: AxiosRequestConfig<D>
	): Promise<R>;
}

describe('::Testes ::getToken-alcis', () => {
	it('deve obter um token corretamente', async () => {
		const responseData = { token: 'token-de-teste' };
		(axios.post as jest.Mock).mockResolvedValue({ data: responseData });

		const token = await getToken('alias-de-teste');

		expect(axios.post).toHaveBeenCalledWith(
			`${process.env.ALCIS_BASE_URL}${process.env.ALCIS_TOKEN_API}`,
			'',
			expect.objectContaining({
				headers: expect.objectContaining({
					Alias: 'alias-de-teste',
					'Content-Type': 'application/json'
				}),
				timeout: 200000
			})
		);

		expect(token).toEqual({ token: responseData.token });
	});

	it('deve lidar com erro ao obter token', async () => {
		const errorMessage =
			'Erro ao recolher o Token Alcis, a API alcis não respondeu';
		(axios.post as jest.Mock).mockRejectedValue({
			message: errorMessage,
			status: 500
		});

		try {
			await getToken('alias-de-teste');
			fail('A exceção esperada não foi lançada.');
		} catch (error) {
			expect(error.message).toBe(errorMessage);
		}
	});
});
