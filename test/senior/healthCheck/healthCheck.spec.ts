import HealthCheckServiceSenior from '../../../services/senior/healthCheck/healthCheck.service';
import { ServiceBroker, ServiceSchema } from 'moleculer';

describe('::Testes ::HealthCheckService', () => {
	let broker = new ServiceBroker({ logger: false });
	broker.createService(HealthCheckServiceSenior);

	const schema: ServiceSchema = {
		name: 'test-service'
	};

	let service: HealthCheckServiceSenior;

	beforeEach(() => {
		service = new HealthCheckServiceSenior(broker, {} as ServiceSchema);
		service.broker.start();
	});

	afterEach(() => {
		service.broker.stop();
	});

	it('deve retornar status 200 quando há serviços disponíveis', async () => {
		service.broker.getLocalNodeInfo = jest
			.fn()
			.mockReturnValue({ services: ['service-1', 'service-2'] });

		const response = await service.actions.create();

		expect(response.Senior.code).toBe(200);
		expect(response.Senior.status).toBe('DOWN');
	});
});
