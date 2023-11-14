import { ServiceBroker, ServiceSchema } from 'moleculer';
import StockData from '../../../services/alcis/stock/stock.service';

describe(':: Testes :: StockData', () => {
	let broker = new ServiceBroker({ logger: false });
	broker.createService(StockData);

	const schema: ServiceSchema = {
		name: 'test-service'
	};

	let service: StockData;

	beforeAll(() => {
		service = new StockData(broker, schema);
		return broker.start();
	});

	afterAll(() => {
		return broker.stop();
	});

	it('deve criar uma instância de StockData', () => {
		expect(service).toBeInstanceOf(StockData);
	});

	it('deveria ter atributos esperados', () => {
		expect(service.indexName).toBe('flow-alcis-stock');
		expect(service.serviceName).toBe('stock.service');
		expect(service.originLayer).toBe('alcis');
	});

	it('deve começar com um corretor válido', () => {
		expect(service.broker).toBe(broker);
	});

	it('deve postar um novo estoque com sucesso', async () => {
		const context = {
			params: {
				site: '021',
				usuario: 'abc',
				codigoDepositante: 'CREMER',
				codigoProduto: '12345',
				statusDoEstoque: '00'
			},
			meta: {}
		};

		const result = await service.postStock(context);

		expect(result).toBeDefined();
	});
});
