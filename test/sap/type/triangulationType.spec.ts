import SendTriangulationTypePfs from '../../../services/sap/type/triangulationType.service';
import { ServiceBroker, ServiceSchema } from 'moleculer';

jest.mock('../../../services/library/axios', () => ({
	AxiosRequestWithOutAuth: jest.fn()
}));

describe('::Testes ::SendTriangulationTypePfs', () => {
	let broker = new ServiceBroker({ logger: false });
	broker.createService(SendTriangulationTypePfs);
	const schema: ServiceSchema = {
		name: 'test-service'
	};

	let sendTriangulationTypePfsService: SendTriangulationTypePfs;

	beforeEach(() => {
		sendTriangulationTypePfsService = new SendTriangulationTypePfs(
			broker,
			schema
		);
	});

	afterAll(async () => {
		await broker.stop();
	});

	it('deve criar uma instância da classe SendTriangulationTypePfs corretamente', () => {
		expect(sendTriangulationTypePfsService).toBeInstanceOf(
			SendTriangulationTypePfs
		);
	});

	it('deveria ter atributos esperados', () => {
		expect(sendTriangulationTypePfsService.indexName).toBe(
			'flow-pfs-type-triangulationtype'
		);
		expect(sendTriangulationTypePfsService.serviceName).toBe(
			'sendTriangulationType.service'
		);
		expect(sendTriangulationTypePfsService.originLayer).toBe('sap');
	});
});
