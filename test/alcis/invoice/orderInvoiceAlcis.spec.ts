import { ServiceBroker, ServiceSchema } from 'moleculer';
import orderInvoiceData from '../../../services/alcis/invoice/orderInvoice.service'; // Substitua pelo caminho correto para o seu arquivo orderInvoiceData

describe(':: Testes :: OrderInvoiceData', () => {
	let broker = new ServiceBroker({ logger: false });
	broker.createService(orderInvoiceData);

	const schema: ServiceSchema = {
		name: 'test-service'
	};

	let service: orderInvoiceData;

	beforeAll(() => {
		service = new orderInvoiceData(broker, schema);
		return broker.start();
	});

	afterAll(() => {
		return broker.stop();
	});

	it('deve criar uma instância de orderInvoiceData', () => {
		expect(service).toBeInstanceOf(orderInvoiceData);
	});

	it('deveria ter atributos esperados', () => {
		expect(service.indexName).toBe('flow-alcis-order-invoice');
		expect(service.serviceName).toBe('order-invoice.service');
		expect(service.originLayer).toBe('alcis');
	});

	it('deve começar com um corretor válido', () => {
		expect(service.broker).toBe(broker);
	});

	it('deve atualizar com sucesso os pedidos de fatura', async () => {
		const context = {
			params: {
				site: '021',
				codigoDepositante: 'CREMER',
				numeroPedido: '12345',
				subPedido: 123,
				numeroNotaFiscal: '12345',
				dataNotaFiscal: '',
				valorTotal: ''
			},
			meta: {}
		};

		const result = await service.putOrderInvoice(context);

		expect(result).toBeDefined();
	});
});
