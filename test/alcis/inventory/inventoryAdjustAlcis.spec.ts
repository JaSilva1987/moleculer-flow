import { ServiceBroker, ServiceSchema } from 'moleculer';
import inventoryAdjustData from '../../../services/alcis/inventory/inventoryAdjust.service'; // Substitua pelo caminho correto do seu arquivo inventoryAdjustData

describe('::Testes ::InventoryAdjustData', () => {
	let broker = new ServiceBroker({ logger: false });
	broker.createService(inventoryAdjustData);
	const schema: ServiceSchema = {
		name: 'test-service'
	};

	let service: inventoryAdjustData;

	beforeAll(() => {
		service = new inventoryAdjustData(broker, schema);
		return broker.start();
	});

	afterAll(() => {
		return broker.stop();
	});

	it('deve criar uma instância de inventárioAdjustData', () => {
		expect(service).toBeInstanceOf(inventoryAdjustData);
	});

	it('deveria ter atributos esperados', () => {
		expect(service.indexName).toBe('flow-alcis-inventory-adjust');
		expect(service.serviceName).toBe('inventory-adjust.service');
		expect(service.originLayer).toBe('alcis');
	});

	it('deve começar com um corretor válido', () => {
		expect(service.broker).toBe(broker);
	});

	it('deve recuperar com êxito os ajustes de inventário', async () => {
		const context = {
			params: {
				site: '021',
				numeroDaTransacao: '123'
			},
			meta: {}
		};

		const result = await service.getInventoryAdjust(context);

		expect(result).toBeDefined();
	});

	it('deve atualizar com sucesso os ajustes de inventário', async () => {
		const context = {
			params: {
				site: '021',
				numeroDaTransacao: 123,
				controller: 'CREMER'
			},
			meta: {}
		};

		const result = await service.putInventoryAdjust(context);

		expect(result).toBeDefined();
	});
});
