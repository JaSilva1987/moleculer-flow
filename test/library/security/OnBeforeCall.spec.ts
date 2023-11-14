import { loggerElastic } from '../../../services/library/elasticSearch/elasticSearch';
import { Context } from 'moleculer';
import { Meta } from '../../../src/interface/library/security/userAgent.interface';
import { IncomingRequest } from 'moleculer-web';
import { checkAgent } from '../../../services/library/security/sanitize/userAgent';
import { chekUrlPath } from '../../../services/library/security/sanitize/queryString';
import { paramsSanitize } from '../../../services/library/security/sanitize/paramsSanitize';
import { ISanitize } from '../../../src/interface/library/security/sanitize.interface';
import { isOnBefore } from '../../../services/library/security/onBeforeCall';

describe('::Testes ::isOnBefore', () => {
	it('deve retornar verdadeiro se houver um agente ou string de consulta suspeito', () => {
		const ctx: Context<unknown, Meta> = {} as Context<unknown, Meta>;
		const req: IncomingRequest = {} as IncomingRequest;
		req.headers = {
			'user-agent':
				'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36'
		};
		req.originalUrl = '/test?query=string';

		jest.spyOn(global.console, 'log').mockImplementation(() => {});

		const result = isOnBefore(ctx, req);

		expect(result).toBeTruthy();
		expect(console.log).toHaveBeenCalledWith(
			'============== TEM AGENTE SUSPEITO!!! =============='
		);
	});

	it('deve retornar verdadeiro se houver uma string de consulta suspeita', () => {
		const ctx: Context<unknown, Meta> = {} as Context<unknown, Meta>;
		const req: IncomingRequest = {} as IncomingRequest;
		req.headers = {};
		req.originalUrl = '/test?query=string';

		jest.spyOn(global.console, 'log').mockImplementation(() => {});

		const result = isOnBefore(ctx, req);

		expect(result).toBeTruthy();
	});
});
