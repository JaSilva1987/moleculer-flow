import HealthCheckService from '../../../services/library/healthCheck/health.service'; // Substitua pelo caminho real do arquivo
import { ServiceBroker, ServiceSchema } from 'moleculer';

describe('::Testes ::HealthCheck', () => {
	let broker = new ServiceBroker({ logger: false });
	broker.createService(HealthCheckService);
	const schema: ServiceSchema = {
		name: 'test-service'
	};

	let service: HealthCheckService;

	beforeEach(() => {
		service = new HealthCheckService(broker);
		service.broker.start();
	});

	afterEach(() => {
		service.broker.stop();
	});

	it('deve retornar status 200 quando há serviços disponíveis', async () => {
		service.broker.getLocalNodeInfo = jest
			.fn()
			.mockReturnValue({ services: ['service-1', 'service-2'] });

		const response = await service.actions.hello();

		expect(response.code).toBe(200);
		expect(response.message).toBe('API On Air');
	});

	it('deve retornar status 500 quando não há serviços disponíveis', async () => {
		service.broker.getLocalNodeInfo = jest
			.fn()
			.mockReturnValue({ services: [] });

		const response = await service.actions.hello();

		expect(response.code).toBe(500);
		expect(response.message).toBe('Out of Air API');
	});
});
