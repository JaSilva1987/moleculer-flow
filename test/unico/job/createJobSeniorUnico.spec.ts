import CreateJobUnicoService from '../../../services/unico/job/createJobSeniorUnico.service';
import { ServiceBroker } from 'moleculer';
import { IControllerUnico } from '../../../src/interface/senior/job/createJobSeniorUnico.interface';

describe('::Testes ::CreateJobUnicoService', () => {
	let broker: ServiceBroker;
	let createJobUnicoService: CreateJobUnicoService;

	beforeEach(() => {
		const emitMock = jest.fn(() =>
			Promise.resolve([
				[
					[
						{
							status: 200,
							message: 'Request created successfully'
						}
					]
				]
			])
		);

		broker = new ServiceBroker({ logger: false });
		broker.createService(CreateJobUnicoService);

		broker.emit = emitMock.bind(broker);

		createJobUnicoService = new CreateJobUnicoService(broker);
	});

	afterAll(async () => {
		await broker.stop();
	});

	it('deve criar uma instância da classe CreateJobUnicoService corretamente', () => {
		expect(createJobUnicoService).toBeInstanceOf(CreateJobUnicoService);
	});

	it('deve chamar o método PostCreateJobSeniorUnico corretamente', async () => {
		const unicoSerniorCreate: IControllerUnico = {
			unit: 'unit123',
			status: 0,
			organization: '',
			message: ''
		};

		const originalEmit = broker.emit;
		broker.emit = jest.fn(originalEmit);

		await createJobUnicoService.PostCreateJobSeniorUnico(
			unicoSerniorCreate
		);

		broker.emit = originalEmit;
	});
});
