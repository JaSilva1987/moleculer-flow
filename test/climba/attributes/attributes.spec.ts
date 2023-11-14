'use strict';
import { ServiceBroker, ServiceSchema, Errors } from 'moleculer';
import PostAttributesClimba from '../../../services/climba/attributes/attributes.service';
import { AxiosRequestType } from '../../../services/library/axios';
import { IAttribute } from '../../../src/interface/climba/attribute/attribute.interface';

jest.mock('../../../services/library/axios');

describe('Teste unitário para PostAttributesClimba', () => {
	let broker: ServiceBroker;
	let postAttributesClimba: PostAttributesClimba;

	beforeAll(() => {
		broker = new ServiceBroker({ logger: false });
		postAttributesClimba = new PostAttributesClimba(
			broker,
			{} as ServiceSchema
		);
	});

	afterAll(() => broker.stop());

	it('deve criar uma instância de PostAttributesClimba', () => {
		expect(postAttributesClimba).toBeInstanceOf(PostAttributesClimba);
	});

	it('deveria ter atributos esperados', () => {
		expect(postAttributesClimba.indexName).toBe('flow-ecommerce-attribute');
		expect(postAttributesClimba.serviceName).toBe(
			'climba.attributes.service'
		);
		expect(postAttributesClimba.originLayer).toBe('climbaEcommerce');
	});

	it('deve chamar AxiosRequestType com os argumentos corretos para o método "put" durante a execução de PostAttributes', async () => {
		const mockMessage = {
			attributeGroupId: 'groupId123',
			id: 'attributeId123',
			name: 'Test Attribute'
		};

		(AxiosRequestType as jest.Mock).mockResolvedValue({
			status: 200,
			message: 'Sucesso'
		});

		(AxiosRequestType as jest.Mock).mockResolvedValueOnce({
			status: 200,
			message: 'Sucesso'
		});

		await postAttributesClimba.PostAttributes(mockMessage);

		expect(AxiosRequestType).toHaveBeenCalledWith(
			process.env.URL_ECOMMERCE +
				`attributes/${mockMessage.attributeGroupId}/${mockMessage.id}`,
			mockMessage,
			'put',
			{ 'x-idcommerce-api-token': process.env.TOKEN_ECOMMERCE }
		);
	});
});
