import { ServiceBroker } from 'moleculer';
import RegisterServices from '../../../services/senior/register/registerSeniorOuro.service';

describe('Teste unitário para RegisterServices', () => {
	let broker: ServiceBroker;
	let registerServices: RegisterServices;

	beforeEach(() => {
		broker = new ServiceBroker({ logger: false });
		broker.createService(RegisterServices);
		registerServices = new RegisterServices(broker);
	});

	afterEach(async () => {
		await broker.stop();
	});

	it('deve criar uma instância da classe RegisterServices corretamente', () => {
		expect(registerServices).toBeInstanceOf(RegisterServices);
	});

	it('deve chamar o método RegisterPost corretamente', async () => {
		const mockContext: any = {
			params: {
				ConsumidorFinal: 'Sim',
				CPF: '12345678900',
				CodigoIntegracao: '123',
				Grupo: 'Grupo de Exemplo',
				Subgrupo: 'Subgrupo de Exemplo',
				Atividade: 'Atividade de Exemplo',
				Nome: 'Nome do Cliente',
				RG: '1234567',
				Sexo: 'Masculino',
				CEP: '12345-678',
				Endereco: 'Endereço de Exemplo',
				Complemento: 'Complemento de Exemplo',
				NumeroEndereco: '123',
				Bairro: 'Bairro de Exemplo',
				Cidade: 'Cidade de Exemplo',
				Estado: 'Estado de Exemplo',
				Pais: 'País de Exemplo',
				Fone1: '(12) 3456-7890',
				Fone2: '(98) 7654-3210',
				Celular: '(99) 8765-4321',
				Email: 'cliente@example.com',
				EmailNFe: 'nfe@example.com',
				LimiteCredito: '1000.00',
				Classificação: 'A',
				IndicadorIE: 'Isento'
			}
		};

		const result = await registerServices.RegisterPost(mockContext);

		expect(result).not.toBeDefined();
		expect(result).not.toBeNull();
	});
});
