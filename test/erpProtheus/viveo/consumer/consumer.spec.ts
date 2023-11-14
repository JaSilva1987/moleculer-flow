import ConsumerErpProtheusViveo from '../../../../services/erpProtheus/viveo/consumer/consumer.service';
import { ServiceBroker, ServiceSchema } from 'moleculer';

describe('::Testes ::ConsumerErpProtheusViveo', () => {
	let broker = new ServiceBroker({ logger: false });
	broker.createService(ConsumerErpProtheusViveo);
	const schema: ServiceSchema = {
		name: 'test-service'
	};

	let consumerErpProtheusViveo: ConsumerErpProtheusViveo;

	beforeEach(() => {
		consumerErpProtheusViveo = new ConsumerErpProtheusViveo(broker, schema);
	});

	afterAll(async () => {
		await broker.stop();
	});

	it('deve criar uma instância da classe ConsumerErpProtheusViveo corretamente', () => {
		expect(consumerErpProtheusViveo).toBeInstanceOf(
			ConsumerErpProtheusViveo
		);
	});

	it('deve ter os atributos esperados', () => {
		expect(consumerErpProtheusViveo.indexName).toBe(
			'flow-crmiso-routeorders'
		);
		expect(consumerErpProtheusViveo.serviceName).toBe('consumer.service');
		expect(consumerErpProtheusViveo.originLayer).toBe('erpprotheusviveo');
	});

	it('deve chamar o método GetConsumerData corretamente', async () => {
		// Simule a variável de ambiente conforme necessário para o teste
		process.env.PROTHEUSVIVEO_BASEURL = 'https://example.com';
		process.env.PROTHEUSVIVEO_RESTCREMER = '/api/';
		process.env.PROTHEUSVIVEO_URLTOKEN = '/token/';
		process.env.PROTHEUSVIVEO_USER = 'username';
		process.env.PROTHEUSVIVEO_PASS = 'password';

		// Crie um objeto de mensagem de exemplo para o teste
		const message = {
			codeClient: '12345',
			codStore: 'STORE123',
			orderId: 'ORDER123'
		};

		// Espie o método GetConsumerData
		const getConsumerDataSpy = jest.spyOn(
			consumerErpProtheusViveo,
			'GetConsumerData'
		);

		// Chame o método GetConsumerData
		await consumerErpProtheusViveo.GetConsumerData(message);

		// Verifique se o método GetConsumerData foi chamado corretamente
		expect(getConsumerDataSpy).toHaveBeenCalledWith(message);

		// Restaure o spy após o teste
		getConsumerDataSpy.mockRestore();
	});
});
