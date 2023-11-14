import {
	paramsSanitize,
	validateXml
} from '../../../../services/library/security/sanitize/paramsSanitize';

describe('::Testes ::paramsSanitize', () => {
	it('deve retornar true para entrada segura', () => {
		const input = 'Texto seguro';
		const resultado = paramsSanitize(input);
		expect(resultado).toBe(false);
	});

	it('deve retornar true para entrada insegura', () => {
		const input = '<script>alert("XSS");</script>';
		const resultado = paramsSanitize(input);
		expect(resultado).toBe(true);
	});

	it('deve retornar true para objeto com entrada insegura', () => {
		const input = {
			field1: 'Texto seguro',
			field2: '<script>alert("XSS");</script>'
		};
		const resultado = paramsSanitize(input);
		expect(resultado).toBe(true);
	});

	it('deve retornar false para objeto com entrada segura', () => {
		const input = {
			field1: 'Texto seguro',
			field2: 'Outro texto seguro'
		};
		const resultado = paramsSanitize(input);
		expect(resultado).toBe(false);
	});
});

describe('::Testes ::validateXml', () => {
	it('deve retornar true para XML seguro', () => {
		const ctx = {
			params: {
				req: {
					$params: {
						body: '<root><data>Texto seguro</data></root>'
					}
				}
			}
		};
		const resultado = validateXml(ctx);
		expect(resultado).toBe(false);
	});
});
