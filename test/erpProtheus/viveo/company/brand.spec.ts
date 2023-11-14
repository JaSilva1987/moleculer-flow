import PoolBrand from '../../../../services/erpProtheus/viveo/company/brand.service';
import { ServiceBroker, ServiceSchema } from 'moleculer';

describe('::Testes ::PoolBrand', () => {
	let broker = new ServiceBroker({ logger: false });
	broker.createService(PoolBrand);
	const schema: ServiceSchema = {
		name: 'test-service'
	};

	let poolBrand: PoolBrand;

	beforeEach(() => {
		poolBrand = new PoolBrand(broker, schema);
	});

	afterAll(async () => {
		await broker.stop();
	});

	it('deve criar uma instância da classe PoolBrand corretamente', () => {
		expect(poolBrand).toBeInstanceOf(PoolBrand);
	});

	it('deve ter os atributos esperados', () => {
		expect(poolBrand.indexName).toBe('flow-ecommerce-brand');
		expect(poolBrand.serviceName).toBe('erpProtheusViveo.brand.service');
		expect(poolBrand.originLayer).toBe('erpprotheusviveo');
	});

	it('deve ter um cronJob configurado e em execução', () => {
		expect(poolBrand.cronJobOne).toBeDefined();
		expect(poolBrand.cronJobOne.running).toBe(true);
	});
});
