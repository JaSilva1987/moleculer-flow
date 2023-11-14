import { ServiceBroker, ServiceSchema } from 'moleculer';
import orderData from '../../../services/alcis/order/order.service';

describe(':: Testes ::OrderData', () => {
	let broker = new ServiceBroker({ logger: false });
	broker.createService(orderData);

	const schema: ServiceSchema = {
		name: 'test-service'
	};

	let service: orderData;

	beforeAll(() => {
		service = new orderData(broker, schema);
		return broker.start();
	});

	afterAll(() => {
		return broker.stop();
	});

	it('deve criar uma instância de orderData', () => {
		expect(service).toBeInstanceOf(orderData);
	});

	it('deveria ter atributos esperados', () => {
		expect(service.indexName).toBe('flow-alcis-order');
		expect(service.serviceName).toBe('order.service');
		expect(service.originLayer).toBe('alcis');
	});

	it('deve começar com um corretor válido', () => {
		expect(service.broker).toBe(broker);
	});

	it('deve postar com sucesso um novo pedido', async () => {
		const context = {
			params: {
				site: '021',
				codigoDepositante: 'CREMER',
				numeroPedido: '12345',
				subPedido: 123,
				idIntegracao: 'CREMER',
				numeroCarga: '12345',
				codigoTransportadora: '12345',
				dataDoPedidoPrevisto: '2019-08-24T14:15:22Z',
				codigoCliente: '12345',
				deposito: '',
				area: '',
				endereco: '',
				sequenciaDeEntrega: 9999,
				tipoDePedido: 'CD',
				prioridade: 99,
				valorTotal: 100,
				moeda: 'R$',
				rota: '',
				itens: [
					{
						numeroItem: 1,
						codigoProduto: '1243',
						quantidade: 10,
						valorUnitario: 10,
						moeda: 'R$',
						unidade: 'CX',
						lote: 'string',
						loteSerial: 'string',
						dataDeProducao: '2019-08-24T14:15:22Z',
						dataDeValidade: '2019-08-24T14:15:22Z',
						statusDoEstoque: '00',
						motivoDoBloqueioDeQualidade: ''
					}
				]
			},
			meta: {}
		};

		const result = await service.postOrder(context);

		expect(result).toBeDefined();
	});
});
