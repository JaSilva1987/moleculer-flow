import { ServiceBroker, Context } from 'moleculer';
import CreateJobService from '../../../services/senior/job/createJobSeniorGupy.service';
import { TCreateJobSeniorGupy } from '../../../src/interface/senior/job/createJobSeniorGupy.interface';
import {
	apmElasticConnect,
	loggerElastic
} from '../../../services/library/elasticSearch';

jest.mock('../../../services/library/elasticSearch');

describe('Teste unitário para CreateJobService', () => {
	let broker: ServiceBroker;
	let createJobService: CreateJobService;

	beforeEach(() => {
		broker = new ServiceBroker({ logger: false });
		broker.createService(CreateJobService);
		createJobService = new CreateJobService(broker);
	});

	afterEach(async () => {
		await broker.stop();
	});

	it('deve criar uma instância da classe CreateJobService corretamente', () => {
		expect(createJobService).toBeInstanceOf(CreateJobService);
	});

	it('deve chamar o método PostCreateJobSeniorGupy corretamente', async () => {
		const mockContext: any = {
			params: {
				customFields: [],
				name: 'Nome do Trabalho',
				type: 'Tipo do Trabalho',
				code: 'Código do Trabalho',
				codeRole: 'Código do Papel',
				codeBranch: 'Código do Ramo',
				codeDepartament: 'Código do Departamento',
				numVacancies: 5,
				departmentId: 123,
				departmentName: 'Nome do Departamento',
				roleId: 456,
				branchId: 789,
				branchName: 'Nome do Ramo',
				salary: {
					currency: '',
					startsAt: 0
				},
				similarRole: 'Papel Semelhante',
				similardepartment: 'Departamento Semelhante',
				addressCountry: 'País',
				addressCountryShortName: 'Sigla do País',
				addressState: 'Estado',
				addressStateShortName: 'Sigla do Estado',
				addressCity: 'Cidade',
				addressStreet: 'Rua',
				addressNumber: '123',
				addressZipCode: '12345-678',
				publicationType: 'Tipo de Publicação',
				description: 'Descrição do Trabalho',
				responsibilities: 'Responsabilidades do Trabalho',
				prerequisites: 'Pré-requisitos do Trabalho',
				reason: 'Motivo do Trabalho'
			}
		};

		const mockResponse: TCreateJobSeniorGupy = {
			status: 200,
			message: {},
			detail: 'Detalhes'
		};

		apmElasticConnect.startTransaction = jest.fn();
		apmElasticConnect.endTransaction = jest.fn();
		createJobService.broker.emit = jest
			.fn()
			.mockResolvedValue([mockResponse]);

		const result = await createJobService.PostCreateJobSeniorGupy(
			mockContext
		);

		expect(apmElasticConnect.startTransaction).toHaveBeenCalledWith(
			'flow-senior',
			'string'
		);
		expect(apmElasticConnect.endTransaction).toHaveBeenCalledWith([
			mockResponse
		]);
		expect(createJobService.broker.emit).toHaveBeenCalledWith(
			'senior.gupy.integration.post.createjob',
			mockContext.params
		);
		expect(loggerElastic).toHaveBeenCalledWith(
			'flow-senior',
			'200',
			'senior',
			'CreateJobService',
			JSON.stringify(mockContext.params),
			JSON.stringify([mockResponse])
		);

		expect(result).toEqual(mockResponse);
	});
});
