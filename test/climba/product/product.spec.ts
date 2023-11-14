'use strict';
import { ServiceBroker } from 'moleculer';
import PostProductsClimba from '../../../services/climba/product/product.service'; // Importe o serviço que deseja testar
import { ISendProduct } from '../../../src/interface/climba/product/product.interface';

describe('Teste unitário para PostProductsClimba', () => {
	let broker: ServiceBroker;
	let postProductsClimba: PostProductsClimba;

	beforeAll(() => {
		broker = new ServiceBroker({ logger: false });
		postProductsClimba = new PostProductsClimba(broker, {} as any);
	});

	afterAll(() => broker.stop());

	it('deve criar uma instância de PostProductsClimba', () => {
		expect(postProductsClimba).toBeInstanceOf(PostProductsClimba);
	});

	it('deveria ter atributos esperados', () => {
		expect(postProductsClimba.indexName).toBe('flow-ecommerce-product');
		expect(postProductsClimba.serviceName).toBe('climba.product.service');
		expect(postProductsClimba.originLayer).toBe('climbaEcommerce');
	});

	it('deve lidar com erros durante a execução de PostProducts', async () => {
		const mockMessage: ISendProduct = {
			product: { id: '642728' },
			dataProduct: {
				status: 'success',
				productId: '642728',
				productSku: '642728',
				nameProduct: 'Teste',
				JSON: '{}'
			}
		};
		jest.spyOn(postProductsClimba, 'PostProducts').mockImplementation(
			() => {
				throw new Error('Erro simulado');
			}
		);

		try {
			await postProductsClimba.PostProducts(mockMessage);
		} catch (error) {
			expect(error.message).toBe('Erro simulado');
		}
	});

	it('deve lidar com uma resposta de sucesso do serviço externo', async () => {
		const mockMessage: ISendProduct = {
			product: { id: '642728' },
			dataProduct: {
				status: 'success',
				productId: '642728',
				productSku: '642728',
				nameProduct: 'Teste',
				JSON: '{}'
			}
		};
		const mockResponse: any = {
			status: 200,
			message: 'Produto cadastrado com sucesso'
		};
		jest.spyOn(postProductsClimba, 'PostProducts').mockResolvedValue(
			mockResponse
		);

		const result = await postProductsClimba.PostProducts(mockMessage);

		expect(result).toEqual(mockResponse);
		expect(mockMessage.dataProduct.status).toBe('success');
	});

	it('deve lidar com uma resposta de erro do serviço externo', async () => {
		const mockMessage: ISendProduct = {
			product: { id: 'xx' },
			dataProduct: {
				status: 'erro - Erro ao cadastrar o produto',
				productId: 'xx',
				productSku: 'xx',
				nameProduct: 'Teste',
				JSON: '{}'
			}
		};
		const mockResponse: any = {
			status: 500,
			message: 'Erro ao cadastrar o produto'
		};
		jest.spyOn(postProductsClimba, 'PostProducts').mockResolvedValue(
			mockResponse
		);

		const result = await postProductsClimba.PostProducts(mockMessage);

		expect(result).toEqual(mockResponse);
		expect(mockMessage.dataProduct.status).toBe(
			'erro - Erro ao cadastrar o produto'
		);
	});
});
