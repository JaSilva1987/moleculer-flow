import { chekUrlPath } from '../../../../services/library/security/sanitize/queryString';

describe('::Testes ::queryString', () => {
	it('deve retornar true quando a URL contiver um agente sujo', () => {
		process.env.TERMS_TO_SEARCH = 'agente1,agente2,agente3';

		const urlComAgenteSujo = 'https://www.example.com/agente1/page';

		const resultado = chekUrlPath(urlComAgenteSujo);

		expect(resultado).toBe(true);
	});

	it('deve retornar false quando a URL não contiver um agente sujo', () => {
		process.env.TERMS_TO_SEARCH = 'agente1,agente2,agente3';

		const urlLimpa = 'https://www.example.com/page';

		const resultado = chekUrlPath(urlLimpa);

		expect(resultado).toBe(false);
	});
});
