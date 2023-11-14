import {
	getToken,
	getTokenGlobal,
	getTokenUrlGlobal
} from '../../../services/library/erpProtheus/getToken';
import ValidaTokenController from '../../../src/controller/integration/token/tokenProtheus.controller';

jest.mock('../../../services/library/axios/axiosRequest', () => ({
	AxiosRequestSimple: jest.fn()
}));

//jest.mock('../../../src/controller/integration/token/tokenProtheus.controller');
jest.mock(
	'../../../src/controller/integration/token/tokenProtheus.controller',
	() => {
		return {
			__esModule: true,
			default: jest.fn()
		};
	}
);

describe('::Testes ::getToken', () => {
	it('deve testar o retorno do Token da função GetToken com sucesso', async () => {
		const expectedToken = 'mocked-token';

		const {
			AxiosRequestSimple
		} = require('../../../services/library/axios/axiosRequest');

		AxiosRequestSimple.mockResolvedValue({
			status: 200,
			message: expectedToken
		});

		const response = await getToken('11');

		expect(response).toBeDefined();
		expect(response).toBe(expectedToken);
	});

	it('deve testar o retorno do Token da função getTokenGlobal com sucesso', async () => {
		const expectedToken = 'mocked-token';

		const {
			AxiosRequestSimple
		} = require('../../../services/library/axios/axiosRequest');

		AxiosRequestSimple.mockResolvedValue({
			status: 200,
			message: expectedToken
		});

		const response = await getTokenGlobal('Mock Teste', '11', '', '', '');

		expect(response).toBeDefined();
		expect(response).toBe(expectedToken);
	});

	it('deve retornar um token válido quando a URL do token é fornecida', async () => {
		const mockController =
			new ValidaTokenController() as jest.Mocked<ValidaTokenController>;

		const mockValidToken = jest.fn().mockResolvedValue('Token válido');
		mockController.validToken = mockValidToken;

		const urlToken = 'https://sua-url-de-token.com';
		const response = await getTokenUrlGlobal(urlToken);

		expect(response).toBeDefined();
	});
});
