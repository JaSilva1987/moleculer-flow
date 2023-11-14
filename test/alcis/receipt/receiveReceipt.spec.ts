import { ServiceBroker, ServiceSchema } from 'moleculer';
import ReceiveReceiptData from '../../../services/alcis/receipt/receiveReceipt.service';

describe(':: Testes :: ReceiveReceiptData', () => {
	let broker = new ServiceBroker({ logger: false });
	broker.createService(ReceiveReceiptData);

	const schema: ServiceSchema = {
		name: 'test-service'
	};

	let service: ReceiveReceiptData;

	beforeAll(() => {
		service = new ReceiveReceiptData(broker, schema);
		return broker.start();
	});

	afterAll(() => {
		return broker.stop();
	});

	it('deve criar uma instância de ReceiveReceiptData', () => {
		expect(service).toBeInstanceOf(ReceiveReceiptData);
	});

	it('deveria ter atributos esperados', () => {
		expect(service.indexName).toBe('flow-alcis-receive-receipt');
		expect(service.serviceName).toBe('receipt.service');
		expect(service.originLayer).toBe('alcis');
	});

	it('deve começar com um corretor válido', () => {
		expect(service.broker).toBe(broker);
	});

	it('deve postar um recibo de recebimento com sucesso', async () => {
		const context = {
			params: {
				site: '021',
				codigoDepositante: 'CREMER',
				numeroNotaFiscal: '12345',
				serieNotaFiscal: '123',
				dataNotaFiscal: '2019-09-24T14:15:22Z',
				codigoFornecedor: '54321',
				tipoDocumento: 'chaveNfe',
				codigoDocumento: '',
				codigoTransportadora: '12345',
				idIntegracao: '34222',
				agrupadorRecebimento: 'string',
				deposito: '',
				tipoDeRecebimento: 'LI',
				placaDoVeiculo: 'string',
				itens: [
					{
						numeroItem: 1,
						codigoProduto: '1243',
						quantidade: 10,
						unidade: 'CX',
						lote: 'string',
						loteSerial: 'string',
						dataDeProducao: '2019-08-24T14:15:22Z',
						dataDeValidade: '2019-08-24T14:15:22Z'
					}
				]
			},
			meta: {}
		};

		const result = await service.postReceiveReceipt(context);

		expect(result).toBeDefined();
	});
});
