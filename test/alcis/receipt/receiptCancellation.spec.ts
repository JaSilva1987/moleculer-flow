import { ServiceBroker, ServiceSchema } from 'moleculer';
import ReceiptCancellationData from '../../../services/alcis/receipt/receiptCancellation.service';

describe(':: Testes :: ReceiptCancellationData', () => {
	let broker = new ServiceBroker({ logger: false });
	broker.createService(ReceiptCancellationData);

	const schema: ServiceSchema = {
		name: 'test-service'
	};

	let service: ReceiptCancellationData;

	beforeAll(() => {
		service = new ReceiptCancellationData(broker, schema);
		return broker.start();
	});

	afterAll(() => {
		return broker.stop();
	});

	it('deve criar uma instância de ReceiptCancellationData', () => {
		expect(service).toBeInstanceOf(ReceiptCancellationData);
	});

	it('deveria ter atributos esperados', () => {
		expect(service.indexName).toBe('flow-alcis-receipt-cancellation');
		expect(service.serviceName).toBe('receipt-cancellation.service');
		expect(service.originLayer).toBe('alcis');
	});

	it('deve começar com um corretor válido', () => {
		expect(service.broker).toBe(broker);
	});

	it('deve atualizar o cancelamento de recibo com sucesso', async () => {
		const context = {
			params: {
				site: '021',
				codigoDepositante: 'CREMER',
				numeroNotaFiscal: 12345,
				serieNotaFiscal: '123',
				idIntegracao: '1',
				controller: 'CREMER'
			},
			meta: {}
		};

		const result = await service.putReceiptCancellation(context);

		expect(result).toBeDefined();
	});
});
