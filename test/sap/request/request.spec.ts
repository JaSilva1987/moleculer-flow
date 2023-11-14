import RequestPfs from '../../../services/sap/request/request.service';
import { ServiceBroker, ServiceSchema, Context } from 'moleculer';
import { Errors } from 'moleculer';
import {
	IItemRequestPfs,
	IRequestPfs
} from '../../../src/interface/sap/request/requestPfs/interface';
import { loggerElastic } from '../../../services/library/elasticSearch';

describe('::Testes ::RequestPfs', () => {
	let broker = new ServiceBroker({ logger: false });
	broker.createService(RequestPfs);
	const schema: ServiceSchema = {
		name: 'test-service'
	};

	let requestPfsService: RequestPfs;

	beforeEach(() => {
		requestPfsService = new RequestPfs(broker, schema);
	});

	afterAll(async () => {
		await broker.stop();
	});

	it('deve criar uma instância da classe RequestPfs corretamente', () => {
		expect(requestPfsService).toBeInstanceOf(RequestPfs);
	});

	it('deveria ter atributos esperados', () => {
		expect(requestPfsService.indexName).toBe('flow-pfs-request');
		expect(requestPfsService.serviceName).toBe('requestPfs.service');
		expect(requestPfsService.originLayer).toBe('sap');
	});

	it('deve gerar um erro ao chamar postRequestPfs com entrada inválida', async () => {
		const itemRequest: IItemRequestPfs = {
			produto: '',
			quantidade: 0,
			preco_unitario: 0,
			tipo_saida: '',
			valor_total: 0,
			codigo_fiscal: ''
		};
		const invalidRequest: IRequestPfs = {
			tipo_pedido: '',
			cliente: '',
			num_pedido: '',
			mensagem_nota: '',
			nat_operacao: 0,
			items: [itemRequest]
		};

		const validatorCompileMock = jest.fn(() => false);
		const validatorCheckMock = jest.fn(() => false);
		const vMock = jest.fn(() => ({
			compile: validatorCompileMock,
			check: validatorCheckMock
		}));

		requestPfsService.v = vMock;

		const context: Context<IRequestPfs> = {
			params: invalidRequest
		} as Context<IRequestPfs>;

		await expect(
			requestPfsService.postRequestPfs(context)
		).rejects.toThrowError(Errors.MoleculerError);
	});
});
