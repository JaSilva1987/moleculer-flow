import { convertValue } from '../../../services/library/convert/convertValue'; // Substitua 'suaFuncao' pelo caminho real para o seu módulo

describe('::Testes ::convertValue', () => {
	it('Converte valor para peso', async () => {
		const result = await convertValue(2, 'weight');
		expect(result).toBe(2000);
	});

	it('Converte valor para medida', async () => {
		const result = await convertValue(3, 'measure');
		expect(result).toBe(300);
	});

	it('Converte valor para moeda', async () => {
		const result = await convertValue(5, 'currency');
		expect(result).toBe(500);
	});
});
