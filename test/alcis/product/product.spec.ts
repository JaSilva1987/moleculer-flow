import { ServiceBroker, ServiceSchema } from 'moleculer';
import ProductData from '../../../services/alcis/product/product.service';

describe(':: Testes :: ProductData', () => {
	let broker = new ServiceBroker({ logger: false });
	broker.createService(ProductData);

	const schema: ServiceSchema = {
		name: 'test-service'
	};

	let service: ProductData;

	beforeAll(() => {
		service = new ProductData(broker, schema);
		return broker.start();
	});

	afterAll(() => {
		return broker.stop();
	});

	it('deve criar uma instância de orderData', () => {
		expect(service).toBeInstanceOf(ProductData);
	});

	it('deveria ter atributos esperados', () => {
		expect(service.indexName).toBe('flow-alcis-product');
		expect(service.serviceName).toBe('product.service');
		expect(service.originLayer).toBe('alcis');
	});

	it('deve começar com um corretor válido', () => {
		expect(service.broker).toBe(broker);
	});

	it('deve obter produtos com sucesso', async () => {
		const context = {
			params: {
				site: '021',
				codigoDepositante: 'CREMER',
				codigoProduto: '1243'
			},
			meta: {}
		};

		const result = await service.getProducts(context);

		expect(result).toBeDefined();
	});

	it('deve postar um novo produto com sucesso', async () => {
		const context = {
			params: {
				site: '021',
				codigoDepositante: 'CREMER',
				codigoProduto: '1243',
				descricaoProduto: 'string',
				descricaoComplementarProduto: 'string'
				// Adicione mais campos de acordo com seu objeto de parâmetros
			},
			meta: {}
		};

		const result = await service.postProduct(context);

		expect(result).toBeDefined();
	});

	it('deve obter produtos com sucesso', async () => {
		const context = {
			params: {
				site: '021',
				codigoDepositante: 'CREMER',
				codigoProduto: '1243'
			},
			meta: {}
		};

		const result = await service.getProducts(context);

		expect(result).toBeDefined();
	});

	it('deve postar um novo produto com sucesso', async () => {
		const context = {
			params: {
				site: '021',
				codigoDepositante: 'CREMER',
				codigoProduto: '1243',
				descricaoProduto: 'string',
				descricaoComplementarProduto: 'string'
			},
			meta: {}
		};

		const result = await service.postProduct(context);

		expect(result).toBeDefined();
	});

	it('deve atualizar um produto com sucesso', async () => {
		const context = {
			params: {
				site: '021',
				codigoDepositante: 'CREMER',
				codigoProduto: '1243',
				descricaoProduto: 'string',
				descricaoComplementarProduto: 'string'
			},
			meta: {}
		};

		const result = await service.putProduct(context);

		expect(result).toBeDefined();
	});
});
