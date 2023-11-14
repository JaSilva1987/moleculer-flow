import { removeEspecialCharacters } from '../../../services/library/crmiso/removeEspecialCharacters';

describe('::Testes ::removeEspecialCharacters', () => {
	it('Remove caracteres especiais e converte maiúsculas para minúsculas', async () => {
		const inputText = 'Olá, Mündö!@#$%^&*()';
		const expectedOutput = 'Ola, Mundo';

		const result = await removeEspecialCharacters(inputText);
		expect(result).toBe(expectedOutput);
	});

	it('Trata entrada vazia', async () => {
		const inputText = '';
		const result = await removeEspecialCharacters(inputText);
		expect(result).toBe('');
	});

	it('Trata entrada com espaços em branco', async () => {
		const inputText = '   ';
		const result = await removeEspecialCharacters(inputText);
		expect(result).toBe('');
	});

	it('Mantém caracteres alfanuméricos e especiais permitidos', async () => {
		const inputText = 'Hello, World! 123-4567';
		const expectedOutput = 'Hello, World 123-4567';

		const result = await removeEspecialCharacters(inputText);
		expect(result).toBe(expectedOutput);
	});
});
