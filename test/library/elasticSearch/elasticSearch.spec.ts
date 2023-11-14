import { loggerElastic } from '../../../services/library/elasticSearch/elasticSearch';

jest.mock('@elastic/elasticsearch', () => {
	const mockIndex = jest.fn();
	const mockIndices = {
		refresh: jest.fn()
	};

	return {
		Client: jest.fn(() => ({
			index: mockIndex,
			indices: mockIndices
		}))
	};
});

jest.mock('moleculer', () => {
	return {
		ServiceBroker: jest.fn(() => ({
			logger: {
				error: jest.fn()
			}
		}))
	};
});

describe('::Testes ::elasticSearch', () => {
	afterEach(() => {
		jest.clearAllMocks();
	});

	it('Deve logar dados no Elasticsearch', async () => {
		const indexName = 'test_index';
		const statusOperation = 'success';
		const originLayer = 'TestLayer';
		const serviceName = 'TestService';
		const requestService = 'TestRequest';
		const responseService = 'TestResponse';

		await loggerElastic(
			indexName,
			statusOperation,
			originLayer,
			serviceName,
			requestService,
			responseService
		);

		// Verifique se a função do Elasticsearch foi chamada corretamente
		expect(require('@elastic/elasticsearch').Client).toHaveBeenCalledTimes(
			1
		);
		expect(
			require('@elastic/elasticsearch').Client().index
		).toHaveBeenCalledTimes(1);
		expect(
			require('@elastic/elasticsearch').Client().indices.refresh
		).toHaveBeenCalledTimes(1);

		expect(
			require('moleculer').ServiceBroker().logger.error
		).not.toHaveBeenCalled();
	});
});
