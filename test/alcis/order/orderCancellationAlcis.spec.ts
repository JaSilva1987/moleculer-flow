import { ServiceBroker, ServiceSchema } from 'moleculer';
import orderCancellationData from '../../../services/alcis/order/orderCancellation.service';

describe(':: Testes :: OrderCancellationData', () => {
	let broker = new ServiceBroker({ logger: false });
	broker.createService(orderCancellationData);

	const schema: ServiceSchema = {
		name: 'test-service'
	};

	let service: orderCancellationData;

	beforeAll(() => {
		service = new orderCancellationData(broker, schema);
		return broker.start();
	});

	afterAll(() => {
		return broker.stop();
	});

	it('deve criar uma instância de orderCancellationData', () => {
		expect(service).toBeInstanceOf(orderCancellationData);
	});

	it('deveria ter atributos esperados', () => {
		expect(service.indexName).toBe('flow-alcis-order-cancellation');
		expect(service.serviceName).toBe('order-cancellation.service');
		expect(service.originLayer).toBe('alcis');
	});

	it('deve começar com um corretor válido', () => {
		expect(service.broker).toBe(broker);
	});

	it('deve obter com sucesso uma ordem de cancelamento', async () => {
		const context = {
			params: {
				site: '021',
				codigoDepositante: 'CREMER',
				numeroPedido: '12345',
				subPedido: '123'
			},
			meta: {}
		};

		const result = await service.getOrderCancellation(context);

		expect(result).toBeDefined();
	});

	it('deve atualizar com sucesso uma ordem de cancelamento', async () => {
		const context = {
			params: {
				site: '021',
				codigoDepositante: 'CREMER',
				numeroPedido: '12345',
				subPedido: 123,
				idIntegracao: '01',
				controller: 'CREMER'
			},
			meta: {}
		};

		const result = await service.putOrderCancellation(context);

		expect(result).toBeDefined();
	});
});
