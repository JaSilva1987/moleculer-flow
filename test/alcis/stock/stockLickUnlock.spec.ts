import { ServiceBroker, ServiceSchema } from 'moleculer';
import StockLockUnlockData from '../../../services/alcis/stock/stockLockUnlock.service';

describe(':: Testes :: StockLockUnlockData', () => {
	let broker = new ServiceBroker({ logger: false });
	broker.createService(StockLockUnlockData);

	const schema: ServiceSchema = {
		name: 'test-service'
	};

	let service: StockLockUnlockData;

	beforeAll(() => {
		service = new StockLockUnlockData(broker, schema);
		return broker.start();
	});

	afterAll(() => {
		return broker.stop();
	});

	it('deve criar uma instância de StockLockUnlockData', () => {
		expect(service).toBeInstanceOf(StockLockUnlockData);
	});

	it('deveria ter atributos esperados', () => {
		expect(service.indexName).toBe('flow-alcis-stock-lock-unlock');
		expect(service.serviceName).toBe('stock-lock-unlock.service');
		expect(service.originLayer).toBe('alcis');
	});

	it('deve começar com um corretor válido', () => {
		expect(service.broker).toBe(broker);
	});

	it('deve obter Stock Lock Unlock com sucesso', async () => {
		const context = {
			params: {
				site: '021',
				numeroDaTransacao: '123'
			},
			meta: {}
		};

		const result = await service.getStockLockUnlock(context);

		expect(result).toBeDefined();
	});

	it('deve atualizar Stock Lock Unlock com sucesso', async () => {
		const context = {
			params: {
				site: '021',
				numeroDaTransacao: 123,
				idIntegracao: 'CREMER',
				controller: 'CREMER'
			},
			meta: {}
		};

		const result = await service.putStockLockUnlock(context);

		expect(result).toBeDefined();
	});
});
