import { ServiceBroker, ServiceSchema } from 'moleculer';
import ReservationConfirmationData from '../../../services/alcis/reservationConfirmation/reservationConfirmation.service';

describe(':: Testes :: ReservationConfirmationData', () => {
	let broker = new ServiceBroker({ logger: false });
	broker.createService(ReservationConfirmationData);

	const schema: ServiceSchema = {
		name: 'test-service'
	};

	let service: ReservationConfirmationData;

	beforeAll(() => {
		service = new ReservationConfirmationData(broker, schema);
		return broker.start();
	});

	afterAll(() => {
		return broker.stop();
	});

	it('deve criar uma instância de ReservationConfirmationData', () => {
		expect(service).toBeInstanceOf(ReservationConfirmationData);
	});

	it('deveria ter atributos esperados', () => {
		expect(service.indexName).toBe('alcis-reservation-confirmation');
		expect(service.serviceName).toBe('reservation-confirmation');
		expect(service.originLayer).toBe('alcis');
	});

	it('deve começar com um corretor válido', () => {
		expect(service.broker).toBe(broker);
	});

	it('deve obter a confirmação de reserva com sucesso', async () => {
		const context = {
			params: {
				site: '021',
				numeroDoRecebimento: '12345'
			},
			meta: {}
		};

		const result = await service.getReservationConfirmation(context);

		expect(result).toBeDefined();
	});
});
