import { ServiceBroker, ServiceSchema } from 'moleculer';
import PoolCategories from '../../../../services/erpProtheus/viveo/category/category.service';
import APISchema from '../../../../services/api.service';

describe('::Testes ::Categories', () => {
	let broker = new ServiceBroker({ logger: false });
	broker.createService(PoolCategories);
	const schema: ServiceSchema = {
		name: 'test-service'
	};

	let poolCategories: PoolCategories;

	beforeEach(() => {
		poolCategories = new PoolCategories(broker, schema);
	});

	afterAll(() => broker.stop());

	it('deve criar uma instância da classe PoolCategories corretamente', () => {
		expect(poolCategories).toBeInstanceOf(PoolCategories);
	});

	it('deve ter os atributos esperados', () => {
		expect(poolCategories.indexName).toBe('flow-ecommerce-categories');
		expect(poolCategories.serviceName).toBe(
			'erpProtheusViveo.category.service'
		);
		expect(poolCategories.originLayer).toBe('erpprotheusviveo');
	});

	it('deve ter um cronJob configurado e em execução', () => {
		expect(poolCategories.cronJobOne).toBeDefined();
		expect(poolCategories.cronJobOne.running).toBe(true);
	});
});
