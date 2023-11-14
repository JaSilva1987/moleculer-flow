import { ServiceBroker, ServiceSchema } from 'moleculer';
import healthCheckData from '../../../services/alcis/healthCheck/healthCheck.service';

describe('healthCheckData', () => {
	let broker = new ServiceBroker({ logger: false });
	broker.createService(healthCheckData);
	const schema: ServiceSchema = {
		name: 'test-service'
	};

	let service: healthCheckData;

	beforeAll(() => {
		service = new healthCheckData(broker, schema);
		return broker.start();
	});

	afterAll(() => {
		return broker.stop();
	});

	it('deve retornar status UP ao verificar a saúde', async () => {
		const ctxMessage: any = {};

		const result = await service.getHealth(ctxMessage);

		expect(result.status).toBe('UP');
	});
});
