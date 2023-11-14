import { ServiceBroker } from 'moleculer';
import CreateJobUnicoService from '../../../services/senior/job/createJobSeniorUnico.service';

jest.mock('../../../services/library/elasticSearch', () => {
	return {
		apmElasticConnect: {
			startTransaction: jest.fn(),
			endTransaction: jest.fn(),
			setTransactionName: jest.fn(),
			captureError: jest.fn()
		},
		loggerElastic: jest.fn()
	};
});

describe('Teste unitário para CreateJobUnicoService', () => {
	let broker: ServiceBroker;
	let createJobUnicoService: CreateJobUnicoService;

	beforeEach(() => {
		broker = new ServiceBroker({ logger: false });
		broker.createService(CreateJobUnicoService);
		createJobUnicoService = new CreateJobUnicoService(broker);
	});

	afterEach(async () => {
		await broker.stop();
	});

	it('deve criar uma instância da classe CreateJobUnicoService corretamente', () => {
		expect(createJobUnicoService).toBeInstanceOf(CreateJobUnicoService);
	});

	it('deve chamar o método PostCreateJobSeniorUnico corretamente', async () => {
		const mockContext: any = {
			params: {
				num_matricula: '12345',
				limit_date: '2023-12-31',
				admission_date: '2023-10-01',
				cost_center: 'Finance',
				pos_number: 'P001',
				organization: 'Company Inc.',
				unit: 'HR Department',
				role: 'HR Manager',
				roleName: 'Manager',
				department: 'Human Resources',
				departmentName: 'HR',
				pagamento: {},
				deficiencia: false,
				jornada: 'Tempo integral',
				profile: {},
				exame: {},
				docs: ['Document 1', 'Document 2'],
				send_sms: true,
				send_email: true
			}
		};

		const result = await createJobUnicoService.PostCreateJobSeniorUnico(
			mockContext
		);

		expect(result).toBeUndefined();
	});
});
