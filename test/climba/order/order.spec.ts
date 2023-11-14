'use strict';
import {
	Context,
	Service as MoleculerService,
	ServiceBroker,
	ServiceSchema
} from 'moleculer';
import { AxiosRequestType } from '../../../services/library/axios';
import GetOrderRequestClimba from '../../../services/climba/order/orderRequest.service';

jest.mock('../../../services/library/axios');
jest.mock('../../../services/library/elasticSearch', () => ({
	apmElasticConnect: {
		setTransactionName: jest.fn().mockReturnThis(),
		captureError: jest.fn().mockReturnThis(),
		endTransaction: jest.fn().mockReturnThis()
	}
}));

describe('Teste unitário para GetOrderRequestClimba', () => {
	let broker: ServiceBroker;
	let getOrderRequestClimba: GetOrderRequestClimba;

	beforeAll(() => {
		broker = new ServiceBroker({ logger: false });
		getOrderRequestClimba = new GetOrderRequestClimba(
			broker,
			{} as ServiceSchema
		);
	});

	afterAll(() => broker.stop());

	it('deve criar uma instância de GetOrderRequestClimba', () => {
		expect(getOrderRequestClimba).toBeInstanceOf(GetOrderRequestClimba);
	});

	it('deveria ter atributos esperados', () => {
		expect(getOrderRequestClimba.indexName).toBe(
			'flow-ecommerce-orderrequest'
		);
		expect(getOrderRequestClimba.serviceName).toBe('climba.order.service');
		expect(getOrderRequestClimba.originLayer).toBe('climbaEcommerce');
	});

	it('deve lidar com erros durante a execução de GetOrderRequest', async () => {
		const mockContext = 'true';

		(AxiosRequestType as jest.Mock).mockRejectedValue(
			new TypeError('Erro simulado')
		);

		await expect(
			getOrderRequestClimba.GetOrderRequest(mockContext)
		).rejects.toThrowError(TypeError);
	});

	it('não deve executar o método GetOrderRequest quando enabled não é true', async () => {
		const mockContext = 'false';

		(AxiosRequestType as jest.Mock).mockResolvedValue({});

		await getOrderRequestClimba.GetOrderRequest(mockContext);

		expect(AxiosRequestType).not.toHaveBeenCalled();
	});

	it('deve lidar com erros durante a execução de GetOrderRequest', async () => {
		const mockContext = 'true';

		(AxiosRequestType as jest.Mock).mockRejectedValue(
			new TypeError('Erro simulado')
		);

		await expect(
			getOrderRequestClimba.GetOrderRequest(mockContext)
		).rejects.toThrowError(TypeError);
	});

	it('deve executar o método postRequestClimba com entradas válidas', async () => {
		const mockContext: any = {
			params: { orderId: 'validOrderId' }
		};

		(AxiosRequestType as jest.Mock).mockResolvedValue({});

		await expect(
			getOrderRequestClimba.postRequestClimba(mockContext)
		).resolves.toEqual({
			status: 201,
			message: 'validOrderId'
		});
	});
});
