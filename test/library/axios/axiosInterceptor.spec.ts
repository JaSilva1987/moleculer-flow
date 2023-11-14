import { axiosInterceptors } from '../../../services/library/axios/axiosInterceptos';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

const mock = new MockAdapter(axios);

describe('::Testes ::axiosInterceptors', () => {
	it('deve chamar axiosInterceptors sem lançar exceções', async () => {
		// Configurar o mock para interceptar a chamada axios
		mock.onAny().reply(200, { data: 'Dados de resposta simulados' });

		const axObj = {
			objtRequest: {
				baseURL: 'https://api.example.com',
				headers: {
					Authorization: 'Bearer seu-token-aqui'
				}
			}
		};

		await expect(axiosInterceptors(axObj)).resolves.not.toThrow();
	});
});
