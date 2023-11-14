import { ServiceBroker, ServiceSchema } from 'moleculer';
import ProviderData from '../../../services/alcis/provider/provider.service';

describe(':: Testes :: ProviderData', () => {
	let broker = new ServiceBroker({ logger: false });
	broker.createService(ProviderData);

	const schema: ServiceSchema = {
		name: 'test-service'
	};

	let service: ProviderData;

	beforeAll(() => {
		service = new ProviderData(broker, schema);
		return broker.start();
	});

	afterAll(() => {
		return broker.stop();
	});

	it('deve criar uma instância de ProviderData', () => {
		expect(service).toBeInstanceOf(ProviderData);
	});

	it('deveria ter atributos esperados', () => {
		expect(service.indexName).toBe('flow-alcis-provider');
		expect(service.serviceName).toBe('provider.service');
		expect(service.originLayer).toBe('alcis');
	});

	it('deve começar com um corretor válido', () => {
		expect(service.broker).toBe(broker);
	});

	it('deve obter fornecedores com sucesso', async () => {
		const context = {
			params: {
				site: '021',
				codigoDepositante: 'CREMER',
				codigoFornecedor: '54321'
			},
			meta: {}
		};

		const result = await service.getProviders(context);

		expect(result).toBeDefined();
	});

	it('deve postar um novo fornecedor com sucesso', async () => {
		const context = {
			params: {
				site: '021',
				codigoDepositante: 'CREMER',
				codigoFornecedor: '54321',
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

		const result = await service.postProvider(context);

		expect(result).toBeDefined();
	});

	it('deve atualizar um fornecedor com sucesso', async () => {
		const context = {
			params: {
				site: '021',
				codigoDepositante: 'CREMER',
				codigoFornecedor: '54321',
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

		const result = await service.putProvider(context);

		expect(result).toBeDefined();
	});
});
