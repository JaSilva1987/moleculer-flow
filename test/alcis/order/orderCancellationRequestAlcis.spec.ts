import { ServiceBroker, ServiceSchema } from 'moleculer';
import orderCancellationRequestData from '../../../services/alcis/order/orderCancellationRequest.service'; // Substitua pelo caminho correto para o seu arquivo orderCancellationRequestData

describe(':: Testes :: OrderCancellationRequestData', () => {
	let broker = new ServiceBroker({ logger: false });
	broker.createService(orderCancellationRequestData);

	const schema: ServiceSchema = {
		name: 'test-service'
	};

	let service: orderCancellationRequestData;

	beforeAll(() => {
		service = new orderCancellationRequestData(broker, schema);
		return broker.start();
	});

	afterAll(() => {
		return broker.stop();
	});

	it('deve criar uma instância de orderCancellationRequestData', () => {
		expect(service).toBeInstanceOf(orderCancellationRequestData);
	});

	it('deveria ter atributos esperados', () => {
		expect(service.indexName).toBe('flow-alcis-order-cancellation-request');
		expect(service.serviceName).toBe('order-cancellation-request.service');
		expect(service.originLayer).toBe('alcis');
	});

	it('deve começar com um corretor válido', () => {
		expect(service.broker).toBe(broker);
	});

	it('deve postar com sucesso uma solicitação de cancelamento de ordem', async () => {
		const context = {
			params: {
				site: '021',
				codigoDepositante: 'CREMER',
				numeroPedido: '12345',
				subPedido: 123,
				motivoCancelamento: 'teste'
			},
			meta: {}
		};

		const result = await service.postOrderCancellationRequest(context);

		expect(result).toBeDefined();
	}, 10000);
});
