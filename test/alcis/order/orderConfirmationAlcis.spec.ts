import { ServiceBroker } from 'moleculer';
import OrderConfirmationData from '../../../services/alcis/order/orderConfirmation.service'; // Importe a classe correta do serviço

describe(':: Testes :: OrderConfirmationData', () => {
	let broker = new ServiceBroker({ logger: false });
	broker.createService(OrderConfirmationData);

	let service: OrderConfirmationData;

	beforeAll(() => {
		service = new OrderConfirmationData(broker);
		return broker.start();
	});

	afterAll(() => {
		return broker.stop();
	});

	it('deve criar uma instância de OrderConfirmationData', () => {
		expect(service).toBeInstanceOf(OrderConfirmationData);
	});

	it('deveria ter atributos esperados', () => {
		expect(service.indexName).toBe('flow-alcis-order-confirmation');
		expect(service.serviceName).toBe('order-confirmation.service');
		expect(service.originLayer).toBe('alcis');
	});

	it('deve começar com um corretor válido', () => {
		expect(service.broker).toBe(broker);
	});
});
