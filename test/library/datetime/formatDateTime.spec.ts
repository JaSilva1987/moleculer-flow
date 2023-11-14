import {
	padTo2Digits,
	formatDate
} from '../../../services/library/dateTime/formatDateTime';

describe('::Testes ::formatDateTime', () => {
	it('Deve preencher número com zero à esquerda', async () => {
		const num = 5;
		const result = await padTo2Digits(num);
		expect(result).toEqual('05');
	});

	it('Deve manter número com dois dígitos', async () => {
		const num = 12;
		const result = await padTo2Digits(num);
		expect(result).toEqual('12');
	});

	it('Deve manter número com mais de dois dígitos', async () => {
		const num = 123;
		const result = await padTo2Digits(num);
		expect(result).toEqual('123');
	});

	it('Deve formatar a data e hora corretamente', async () => {
		const mockDate = {
			getFullYear: () => 2023,
			getMonth: () => 8,
			getDate: () => 13,
			getHours: () => 14,
			getMinutes: () => 30,
			getSeconds: () => 45
		};

		const result = await formatDate(mockDate);
		expect(result).toEqual('2023-09-13 14:30:45');
	});
});
