import {
	clearJson,
	removerAcentos
} from '../../../services/library/erpProtheus/clearJson';

describe('::Testes ::clearJson', () => {
	it('deve testar a função clearJson', async () => {
		const input = "{ a: 'b', c: 'd' }";
		const expectedOutput = '{ a: b, c: d }';
		expect(await clearJson(input)).toEqual(expectedOutput);
	});

	it('deve testar a função clearJson com retorno incorreto', async () => {
		const input = "{ a: 'b1', c: 'd' }";
		const expectedOutput = '{ a: b, c: d }';
		expect(await clearJson(input)).not.toEqual(expectedOutput);
	});

	it('deve testar a função removerAcentos', async () => {
		const input = 'Olá, tudo bem?';
		const expectedOutput = 'ola, tudo bem?';
		expect(await removerAcentos(input)).toEqual(expectedOutput);
	});
});
