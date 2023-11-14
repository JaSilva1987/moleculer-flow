import { ServiceBroker, ServiceSchema } from 'moleculer';
import CityProtheus from '../../../../services/erpProtheus/viveo/city/city.service';
import { ICityProtheus } from '../../../../src/interface/erpProtheus/city/city.interface';
import APISchema from '../../../../services/api.service';

describe('::Testes ::City', () => {
	let broker = new ServiceBroker({ logger: false });
	broker.createService(CityProtheus);
	let apiService = broker.createService(APISchema);
	const schema: ServiceSchema = {
		name: 'test-service'
	};

	let cityProtheus: CityProtheus;
	beforeEach(() => {
		cityProtheus = new CityProtheus(broker, schema);
	});
	afterAll(() => broker.stop());

	it('deve buscar dados da cidade usando GetCity', async () => {
		const mockCity: ICityProtheus = {
			country: 'RO',
			codeCounty: '00130',
			city: "MACHADINHO D'OESTE"
		};

		const result = await cityProtheus.GetCity(mockCity);

		expect(result).toEqual(mockCity);
	});
});
