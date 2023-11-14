'use strict';
import { ServiceBroker, ServiceSchema, Errors } from 'moleculer';
import PostcategoriesClimba from '../../../services/climba/category/category.service';
import { AxiosRequestType } from '../../../services/library/axios';
import { ICategory } from '../../../src/interface/climba/categories/categories.interface';

jest.mock('../../../services/library/axios');
jest.mock('../../../services/library/elasticSearch'); // Mock do loggerElastic

describe('Teste unitário para PostcategoriesClimba', () => {
	let broker: ServiceBroker;
	let postcategoriesClimba: PostcategoriesClimba;

	beforeAll(() => {
		broker = new ServiceBroker({ logger: false });
		postcategoriesClimba = new PostcategoriesClimba(
			broker,
			{} as ServiceSchema
		);
	});

	afterAll(() => broker.stop());

	it('deve criar uma instância de PostcategoriesClimba', () => {
		expect(postcategoriesClimba).toBeInstanceOf(PostcategoriesClimba);
	});

	it('deveria ter atributos esperados', () => {
		expect(postcategoriesClimba.indexName).toBe(
			'flow-ecommerce-categories'
		);
		expect(postcategoriesClimba.serviceName).toBe(
			'climba.category.service'
		);
		expect(postcategoriesClimba.originLayer).toBe('climbaEcommerce');
	});

	it('deve chamar AxiosRequestType com os argumentos corretos para o método "post" durante a execução de PostCategories', async () => {
		const mockMessage: ICategory = {
			id: 'category123',
			name: 'Test Category'
		};

		(AxiosRequestType as jest.Mock).mockResolvedValue({
			status: 201,
			message: 'Categoria criada com sucesso'
		});

		const result = await postcategoriesClimba.PostCategories(mockMessage);

		expect(AxiosRequestType).toHaveBeenCalledWith(
			process.env.URL_ECOMMERCE + `categories`,
			mockMessage,
			'post',
			{ 'x-idcommerce-api-token': process.env.TOKEN_ECOMMERCE }
		);
	});
});
