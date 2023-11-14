import useragent from 'useragent';
import { loggerElastic } from '../../../../services/library/elasticSearch';
import { checkAgent } from '../../../../services/library/security/sanitize/userAgent';

jest.mock('../../../../services/library/elasticSearch/elasticSearch', () => ({
	loggerElastic: jest.fn()
}));

describe('checkAgent', () => {
	it('deve retornar verdadeiro se o agente estiver bloqueado', () => {
		const agentCheck =
			'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3';
		process.env.USER_AGENTS_BLOCKED = 'Chrome';
		expect(checkAgent(agentCheck)).toBe(true);
	});

	it('deve retornar falso se o agente não estiver bloqueado', () => {
		const agentCheck =
			'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3';
		process.env.USER_AGENTS_BLOCKED = 'Firefox';
		expect(checkAgent(agentCheck)).toBe(false);
	});

	it('deve retornar verdadeiro e registrar um erro quando ocorrer uma exceção', () => {
		process.env.USER_AGENTS_BLOCKED = 'BlockedAgent1,BlockedAgent2';
		const agentCheck = 'UserAgent';

		jest.spyOn(useragent, 'parse').mockImplementation(() => {
			throw new Error('Mocked Error');
		});

		const result = checkAgent(agentCheck);

		expect(result).toBe(true);

		expect(loggerElastic).toHaveBeenCalledWith(
			'flow-security',
			'499',
			'validation-agent',
			'checkAgent',
			JSON.stringify(agentCheck),
			JSON.stringify('Mocked Error')
		);
	});
});
