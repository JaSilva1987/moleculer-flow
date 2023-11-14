import { ServiceBroker } from 'moleculer';
import CandidateHiredUnicoService from '../../../services/unico/candidate/candidateHiredSeniorUnico.service'; // Substitua pelo caminho correto do seu arquivo CandidateHiredUnicoService

describe(':: Testes :: CandidateHiredUnicoService', () => {
	let broker: ServiceBroker;
	let candidateHiredUnicoService: CandidateHiredUnicoService;

	beforeEach(() => {
		const emitMock = jest.fn(() =>
			Promise.resolve([
				{
					status: 200,
					message: 'Request created successfully'
				}
			])
		);

		broker = new ServiceBroker({ logger: false });
		broker.createService(CandidateHiredUnicoService);

		broker.emit = emitMock.bind(broker);

		candidateHiredUnicoService = new CandidateHiredUnicoService(broker);
	});

	afterAll(async () => {
		await broker.stop();
	});

	it('deve criar uma instância da classe CandidateHiredUnicoService corretamente', () => {
		expect(candidateHiredUnicoService).toBeInstanceOf(
			CandidateHiredUnicoService
		);
	});

	it('deve chamar o método PostCandidateHiredSeniorUnico corretamente', async () => {
		const unicoSeniorCandidate = {
			integration: 'test',
			position: 'test-position',
			'position-number': '123',
			unit: 'test-unit',
			event: 'test-event'
		};

		const context = {
			params: unicoSeniorCandidate,
			meta: {},
			id: 'your-id',
			broker: broker,
			endpoint: 'your-endpoint',
			action: 'your-action',
			event: 'your-event',
			service: 'your-service',
			nodeID: 'your-nodeID'
		};

		const originalEmit = broker.emit;
		broker.emit = jest.fn(originalEmit);

		await candidateHiredUnicoService.PostCandidateHiredSeniorUnico(
			context as any
		);

		broker.emit = originalEmit;
	});
});
