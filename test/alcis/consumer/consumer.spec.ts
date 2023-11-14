import { ServiceBroker, ServiceSchema } from 'moleculer';
import consumerData from '../../../services/alcis/consumer/consumer.service'; // Substitua pelo caminho correto do seu arquivo consumerData

describe('::Testes ::Consumer', () => {
	let broker = new ServiceBroker({ logger: false });
	broker.createService(consumerData);
	const schema: ServiceSchema = {
		name: 'test-service'
	};

	let service: consumerData;

	beforeAll(() => {
		service = new consumerData(broker, schema);
		return broker.start();
	});

	afterAll(() => {
		return broker.stop();
	});

	it('deve criar uma instância de consumerData', () => {
		expect(service).toBeInstanceOf(consumerData);
	});

	it('deveria ter atributos esperados', () => {
		expect(service.indexName).toBe('flow-alcis-consumer');
		expect(service.serviceName).toBe('consumer.service');
		expect(service.originLayer).toBe('alcis');
	});

	it('deve começar com um corretor válido', () => {
		expect(service.broker).toBe(broker);
	});

	it('deve buscar com sucesso os dados do consumidor', async () => {
		const context = {
			params: {
				site: '021',
				codigoDepositante: 'CREMER',
				codigoCliente: '222134'
			},
			meta: {}
		};

		const result = await service.getConsumer(context);

		expect(result).toBeDefined();
	});

	it('deve atualizar com sucesso os dados do consumidor', async () => {
		// Mock the context object and params
		const context = {
			params: {
				site: '021',
				codigoDepositante: 'CREMER',
				codigoCliente: '222134',
				cnpjCpf: '44602429076',
				razaoSocial: 'TESTEEEEEE',
				nomeFantasia: 'TESTE',
				tipoDePessoa: '1',
				inscricaoEstadual: '745755424374',
				enderecos: {
					tipoDeEndereco: '1',
					cep: '03120010',
					numeroDoLogradouro: '260',
					complementoDoEndereco: 'Segundo andar',
					rota: 'Zona Leste',
					pais: 'BRA',
					estado: 'SP',
					cidade: 'Sao Paulo',
					bairro: 'Mooca',
					logradouro: 'Rua Curupace'
				},
				contatos: {
					tipoDeContato: '1',
					contato: 'Fulano dos tal',
					telefonePrimario: '00000000000',
					telefoneSecundario: '00000000000',
					email: 'teste@gmail.com'
				}
			},
			meta: {}
		};

		const result = await service.putConsumer(context);

		expect(result).toBeDefined();
	});

	it('deve postar com sucesso novos dados do consumidor', async () => {
		const context = {
			params: {
				site: '021',
				codigoDepositante: 'CREMER',
				codigoCliente: '12345',
				cnpjCpf: '44602429076',
				razaoSocial: 'TESTE',
				nomeFantasia: 'TESTE',
				tipoDePessoa: '1',
				inscricaoEstadual: '745755424374',
				enderecos: {
					tipoDeEndereco: '1',
					cep: '03120010',
					numeroDoLogradouro: '260',
					complementoDoEndereco: 'Segundo andar',
					rota: 'Zona Leste',
					pais: 'BRA',
					estado: 'SP',
					cidade: 'Sao Paulo',
					bairro: 'Mooca',
					logradouro: 'Rua Curupace'
				},
				contatos: {
					tipoDeContato: '1',
					contato: 'Fulano dos tal',
					telefonePrimario: '00000000000',
					telefoneSecundario: '00000000000',
					email: 'teste@gmail.com'
				}
			},
			meta: {}
		};

		const result = await service.postConsumer(context);

		expect(result).toBeDefined();
	});
});
