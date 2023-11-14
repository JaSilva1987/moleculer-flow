import { ServiceBroker, ServiceSchema } from 'moleculer';
import orderDispatchData from '../../../services/alcis/order/orderDispatch.service';

describe(':: Testes :: OrderDispatchData', () => {
	let broker = new ServiceBroker({ logger: false });
	broker.createService(orderDispatchData);

	const schema: ServiceSchema = {
		name: 'test-service'
	};

	let service: orderDispatchData;

	beforeAll(async () => {
		service = new orderDispatchData(broker, schema);
		await broker.start();
	});

	afterAll(async () => {
		await broker.stop();
	});

	it('deve criar uma instância de orderDispatchData', () => {
		expect(service).toBeInstanceOf(orderDispatchData);
	});

	it('deveria ter atributos esperados', () => {
		expect(service.indexName).toBe('flow-alcis-order-dispatch');
		expect(service.serviceName).toBe('order-dispatch.service');
		expect(service.originLayer).toBe('alcis');
	});

	it('deve começar com um corretor válido', () => {
		expect(service.broker).toBe(broker);
	});

	it('deve obter com sucesso uma ordem de despacho', async () => {
		const context = {
			params: {
				site: '021',
				codigoDepositante: 'CREMER',
				numeroPedido: '12345',
				subPedido: '123'
			},
			meta: {}
		};

		const result = await service.getOrderConfirmation(context);

		expect(result).toBeDefined();
	});

	it('deve atualizar com sucesso uma ordem de despacho', async () => {
		const context = {
			params: {
				site: '021',
				codigoDepositante: 'CREMER',
				numeroPedido: '12345',
				subPedido: 123,
				numeroCarga: '11111',
				idIntegracao: 'CREMER',
				controller: 'CREMER'
			},
			meta: {}
		};

		const result = await service.putOrderDispatch(context);

		expect(result).toBeDefined();
	});
});
