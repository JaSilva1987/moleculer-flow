'use strict';
import { ServiceBroker, ServiceSchema } from 'moleculer';
import PostBrandClimba from '../../../services/climba/brand/brand.service';
import { AxiosRequestType } from '../../../services/library/axios';

jest.mock('../../../services/library/axios');

describe('::Teste ::Brand', () => {
	let broker: ServiceBroker;
	let postBrandClimba: PostBrandClimba;

	beforeAll(() => {
		broker = new ServiceBroker({ logger: false });
		postBrandClimba = new PostBrandClimba(broker, {} as ServiceSchema);
	});

	afterAll(() => broker.stop());

	it('deve criar uma instância de PostBrandClimba', () => {
		expect(postBrandClimba).toBeInstanceOf(PostBrandClimba);
	});

	it('deveria ter atributos esperados', () => {
		expect(postBrandClimba.indexName).toBe('flow-ecommerce-brand');
		expect(postBrandClimba.serviceName).toBe('climba.brand.service');
		expect(postBrandClimba.originLayer).toBe('climbaEcommerce');
	});

	it('deve começar com um corretor válido', () => {
		expect(postBrandClimba.broker).toBe(broker);
	});

	it('deve postar uma marca corretamente', async () => {
		const mockMessage = {
			id: 'brand123',
			name: 'Test Brand'
		};

		(AxiosRequestType as jest.Mock).mockResolvedValue({
			status: 201,
			message: 'Marca criada com sucesso'
		});

		const result = await postBrandClimba.PostBrand(mockMessage);

		expect(AxiosRequestType).toHaveBeenCalledWith(
			process.env.URL_ECOMMERCE + `brands/${mockMessage.id}`,
			mockMessage,
			'get',
			{ 'x-idcommerce-api-token': process.env.TOKEN_ECOMMERCE }
		);

		expect(AxiosRequestType).toHaveBeenCalledWith(
			process.env.URL_ECOMMERCE + `brands`,
			mockMessage,
			'post',
			{ 'x-idcommerce-api-token': process.env.TOKEN_ECOMMERCE }
		);
	});
});
