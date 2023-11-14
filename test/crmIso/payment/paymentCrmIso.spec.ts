// paymentsCrmIsoService.test.ts

import { ServiceBroker, ServiceSchema } from 'moleculer';
import PaymentsCrmIsoService from '../../../services/crmIso/payment/paymentCrmIso.service'; // Importe a classe que você deseja testar

describe('::Test ::PaymentsCrmIsoService', () => {
	let broker = new ServiceBroker({ logger: false });
	broker.createService(PaymentsCrmIsoService);
	const schema: ServiceSchema = {
		name: 'test-service'
	};

	let service: PaymentsCrmIsoService;

	beforeAll(() => {
		service = new PaymentsCrmIsoService(broker, schema);
	});

	it('deve retornar o registro diferente de array', async () => {
		const result = await service.PoolQueryCrmPayments('');

		expect(Array.isArray(result)).toBe(false);
	});
});
