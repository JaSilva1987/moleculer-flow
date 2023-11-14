'use strict';
import { ServiceBroker, ServiceSchema, Errors } from 'moleculer';
import StockProductsClimba from '../../../services/climba/stock/stock.service';
import { AxiosRequestType } from '../../../services/library/axios';
import { ISendProductStock } from '../../../src/interface/climba/product/product.interface';

jest.mock('../../../services/library/axios');
jest.mock('../../../services/library/elasticSearch', () => ({
	loggerElastic: jest.fn()
}));

describe('Teste unitário para StockProductsClimba', () => {
	let broker: ServiceBroker;
	let stockProductsClimba: StockProductsClimba;

	beforeAll(() => {
		broker = new ServiceBroker({ logger: false });
		stockProductsClimba = new StockProductsClimba(
			broker,
			{} as ServiceSchema
		);
	});

	afterAll(() => broker.stop());

	it('deve criar uma instância de StockProductsClimba', () => {
		expect(stockProductsClimba).toBeInstanceOf(StockProductsClimba);
	});

	it('deveria ter atributos esperados', () => {
		expect(stockProductsClimba.indexName).toBe('flow-ecommerce-stock');
		expect(stockProductsClimba.serviceName).toBe(
			'patchstockClimba.service'
		);
		expect(stockProductsClimba.originLayer).toBe('climbaEcommerce');
	});

	it('deve lidar com erros durante a execução de stockProducts', async () => {
		const mockMessage = {
			id: 'product123',
			updateStock: {
				quantity: 0
			}
		};

		(AxiosRequestType as jest.Mock).mockRejectedValue(
			new TypeError('Erro simulado')
		);

		await expect(
			stockProductsClimba.stockProducts(mockMessage)
		).rejects.toThrowError(TypeError);
	});
});
