import { ServiceBroker, ServiceSchema } from 'moleculer';
import ReceiptReceivedConfirmationData from '../../../services/alcis/receipt/receiptReceivedConfirmation.service';

describe(':: Testes :: ReceiptReceivedConfirmationData', () => {
	let broker = new ServiceBroker({ logger: false });
	broker.createService(ReceiptReceivedConfirmationData);

	const schema: ServiceSchema = {
		name: 'test-service'
	};

	let service: ReceiptReceivedConfirmationData;

	beforeAll(() => {
		service = new ReceiptReceivedConfirmationData(broker, schema);
		return broker.start();
	});

	afterAll(() => {
		return broker.stop();
	});

	it('deve criar uma instância de ReceiptReceivedConfirmationData', () => {
		expect(service).toBeInstanceOf(ReceiptReceivedConfirmationData);
	});

	it('deveria ter atributos esperados', () => {
		expect(service.indexName).toBe('flow-alcis-receipt-confirmation');
		expect(service.serviceName).toBe('receipt-cancellation.service');
		expect(service.originLayer).toBe('alcis');
	});

	it('deve começar com um corretor válido', () => {
		expect(service.broker).toBe(broker);
	});

	it('deve obter confirmação de recibo recebido com sucesso', async () => {
		const context = {
			params: {
				site: '021',
				numeroDoRecebimento: '12345'
			},
			meta: {}
		};

		const result = await service.getReceiptReceivedConfirmation(context);

		expect(result).toBeDefined();
	});

	it('deve atualizar a confirmação de recibo recebido com sucesso', async () => {
		const context = {
			params: {
				site: '021',
				numeroDoRecebimento: 12345,
				idIntegracao: 'CREMER',
				controller: 'CREMER'
			},
			meta: {}
		};

		const result = await service.putReceiptReceivedConfirmation(context);

		expect(result).toBeDefined();
	});
});
