import { ServiceBroker, ServiceSchema, Context } from 'moleculer';
import orderStatusData from '../../../services/alcis/order/orderStatus.service'; // Substitua pelo caminho correto para o seu arquivo orderStatusData

describe(':: Testes :: OrderStatusData', () => {
	let broker = new ServiceBroker({ logger: false });
	broker.createService(orderStatusData);

	const schema: ServiceSchema = {
		name: 'test-service'
	};

	let service: orderStatusData;

	beforeAll(() => {
		service = new orderStatusData(broker, schema);
		return broker.start();
	});

	afterAll(() => {
		return broker.stop();
	});

	it('deve criar uma instância de orderStatusData', () => {
		expect(service).toBeInstanceOf(orderStatusData);
	});

	it('deveria ter atributos esperados', () => {
		expect(service.indexName).toBe('flow-alcis-order-status');
		expect(service.serviceName).toBe('order-status.service');
		expect(service.originLayer).toBe('alcis');
	});
});
