'use strict';
import { ServiceBroker, ServiceSchema } from 'moleculer';
import { AxiosRequestType } from '../../../services/library/axios';
import { ISendInvoiceOrder } from '../../../src/interface/climba/invoice/invoice.interface';
import PostInvoiceOrderClimba from '../../../services/climba/invoice/invoice.service';

jest.mock('../../../services/library/axios');

describe('Teste unitário para PostInvoiceOrderClimba', () => {
	let broker: ServiceBroker;
	let postInvoiceOrderClimba: PostInvoiceOrderClimba;

	beforeAll(() => {
		broker = new ServiceBroker({ logger: false });
		postInvoiceOrderClimba = new PostInvoiceOrderClimba(
			broker,
			{} as ServiceSchema
		);
	});

	afterAll(() => broker.stop());

	it('deve criar uma instância de PostInvoiceOrderClimba', () => {
		expect(postInvoiceOrderClimba).toBeInstanceOf(PostInvoiceOrderClimba);
	});

	it('deveria ter atributos esperados', () => {
		expect(postInvoiceOrderClimba.indexName).toBe('flow-ecommerce-invoice');
		expect(postInvoiceOrderClimba.serviceName).toBe(
			'climba.invoice.service'
		);
		expect(postInvoiceOrderClimba.originLayer).toBe('climbaEcommerce');
	});

	it('deve lidar com erros durante a execução de PostInvoiceOrderClimba', async () => {
		const mockMessage: ISendInvoiceOrder = {
			dataInvoice: {
				idOrder: 'orderId123',
				numberInvoice: 'invoice123',
				JSON: '',
				status: ''
			},
			jsonInvoice: {
				number: '',
				nfeAccessKey: '',
				logisticOperatorId: '',
				xml: '',
				volumes: ''
			}
		};

		(AxiosRequestType as jest.Mock).mockRejectedValue(
			new TypeError('Erro simulado')
		);

		await expect(
			postInvoiceOrderClimba.PostInvoiceOrder(mockMessage)
		).rejects.toThrowError(TypeError);
	});
});
