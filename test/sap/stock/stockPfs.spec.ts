import SendStock from '../../../services/sap/stock/stockPfs.service';
import { ServiceBroker, ServiceSchema } from 'moleculer';

jest.mock('../../../services/library/axios', () => ({
	AxiosRequestWithOutAuth: jest.fn()
}));

describe('::Testes ::SendStock', () => {
	let broker = new ServiceBroker({ logger: false });
	broker.createService(SendStock);
	const schema: ServiceSchema = {
		name: 'test-service'
	};

	let sendStockService: SendStock;

	beforeEach(() => {
		sendStockService = new SendStock(broker, schema);
	});

	afterAll(async () => {
		await broker.stop();
	});

	it('deve criar uma instância da classe SendStock corretamente', () => {
		expect(sendStockService).toBeInstanceOf(SendStock);
	});

	it('deveria ter atributos esperados', () => {
		expect(sendStockService.indexName).toBe('flow-pfs-stock');
		expect(sendStockService.serviceName).toBe('stockPfs.service');
		expect(sendStockService.originLayer).toBe('sap');
	});
});
