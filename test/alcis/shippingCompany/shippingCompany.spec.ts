import { ServiceBroker, ServiceSchema } from 'moleculer';
import ShippingCompanyData from '../../../services/alcis/shippingCompany/shippingCompany.service';

describe(':: Testes :: ShippingCompanyData', () => {
	let broker = new ServiceBroker({ logger: false });
	broker.createService(ShippingCompanyData);

	const schema: ServiceSchema = {
		name: 'test-service'
	};

	let service: ShippingCompanyData;

	beforeAll(() => {
		service = new ShippingCompanyData(broker, schema);
		return broker.start();
	});

	afterAll(() => {
		return broker.stop();
	});

	it('deve criar uma instância de ShippingCompanyData', () => {
		expect(service).toBeInstanceOf(ShippingCompanyData);
	});

	it('deveria ter atributos esperados', () => {
		expect(service.indexName).toBe('flow-alcis-shipping-company');
		expect(service.serviceName).toBe('shipping-company.service');
		expect(service.originLayer).toBe('alcis');
	});

	it('deve começar com um corretor válido', () => {
		expect(service.broker).toBe(broker);
	});

	it('deve obter informações da empresa de transporte com sucesso', async () => {
		const context = {
			params: {
				site: '021',
				codigoTransportadora: '12345'
			},
			meta: {}
		};

		const result = await service.getShippingCompany(context);

		expect(result).toBeDefined();
	});

	it('deve criar uma nova empresa de transporte com sucesso', async () => {
		const context = {
			params: {
				site: '021',
				codigoTransportadora: '12345',
				cnpjCpf: '25024135083',
				razaoSocial: 'string',
				nomeFantasia: 'string',
				tipoDePessoa: '1',
				inscricaoEstadual: '745755424374',
				enderecos: {
					tipoDeEndereco: '1',
					cep: '03120010',
					numeroDoLogradouro: '260',
					complementoDoEndereco: 'Primeiro andar',
					rota: 'Zona Leste',
					pais: 'BRA',
					estado: 'SP',
					cidade: 'Sao Paulo',
					bairro: 'Mooca',
					logradouro: 'Rua Curupace'
				},
				contatos: {
					tipoDeContato: '1',
					contato: 'Fulano de tal',
					telefonePrimario: '00000000000',
					telefoneSecundario: '00000000000',
					email: 'email@email.com'
				}
			},
			meta: {}
		};

		const result = await service.postShippingCompany(context);

		expect(result).toBeDefined();
	});

	it('deve atualizar informações da empresa de transporte com sucesso', async () => {
		const context = {
			params: {
				site: '021',
				codigoTransportadora: '12345',
				cnpjCpf: '25024135083',
				razaoSocial: 'string',
				nomeFantasia: 'string',
				tipoDePessoa: '1',
				inscricaoEstadual: '745755424374',
				enderecos: {
					tipoDeEndereco: '1',
					cep: '03120010',
					numeroDoLogradouro: '260',
					complementoDoEndereco: 'Primeiro andar',
					rota: 'Zona Leste',
					pais: 'BRA',
					estado: 'SP',
					cidade: 'Sao Paulo',
					bairro: 'Mooca',
					logradouro: 'Rua Curupace'
				},
				contatos: {
					tipoDeContato: '1',
					contato: 'Fulano de tal',
					telefonePrimario: '00000000000',
					telefoneSecundario: '00000000000',
					email: 'email@email.com'
				}
			},
			meta: {}
		};

		const result = await service.putShippingCompany(context);

		expect(result).toBeDefined();
	});
});
