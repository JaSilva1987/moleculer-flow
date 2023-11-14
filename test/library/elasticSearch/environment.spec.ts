import ip from 'ip';

import { environmentElastic } from '../../../services/library/elasticSearch/environment';

// Mock de variáveis de ambiente
process.env.ENVIRONMENT_IP_PRODUCTION = '192.168.1.1';
process.env.ENVIRONMENT_IP_HOMOLOGATION = '192.168.1.2';
process.env.ENVIRONMENT_IP_DEVELOPMENT = '192.168.1.3';

process.env.ENVIRONMENT_PRODUCTION = 'Production';
process.env.ENVIRONMENT_HOMOLOGATION = 'Homologation';
process.env.ENVIRONMENT_DEVELOPMENT = 'Development';

describe('::Testes ::environmentElastic', () => {
	afterEach(() => {
		jest.resetAllMocks();
	});

	test('Deve retornar o ambiente de produção', () => {
		jest.spyOn(ip, 'address').mockReturnValue('192.168.1.1');

		const result = environmentElastic();
		expect(result).toEqual('Production');
	});

	test('Deve retornar o ambiente de homologação', () => {
		jest.spyOn(ip, 'address').mockReturnValue('192.168.1.2');

		const result = environmentElastic();
		expect(result).toEqual('Homologation');
	});

	test('Deve retornar o ambiente de desenvolvimento (padrão)', () => {
		jest.spyOn(ip, 'address').mockReturnValue('192.168.1.4');

		const result = environmentElastic();
		expect(result).toEqual('Development');
	});
});
