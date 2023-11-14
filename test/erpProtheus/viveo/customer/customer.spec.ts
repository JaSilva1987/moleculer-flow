import { IGetToken } from '../../../../src/interface/erpProtheus/global';
import CustomerProtheus from '../../../../services/erpProtheus/viveo/customer/customer.service';
import { getTokenUrlGlobal } from '../../../../services/library/erpProtheus';
import { ServiceBroker, ServiceSchema } from 'moleculer';
import { AxiosRequestType } from '../../../../services/library/axios';

// Mock para a função getTokenUrlGlobal
jest.mock('../../../../services/library/erpProtheus', () => ({
	getTokenUrlGlobal: jest.fn()
}));

// Mock para AxiosRequestConfig
jest.mock('../../../../services/library/axios', () => ({
	AxiosRequestType: jest.fn()
}));

describe('::Testes ::CustomerProtheus Service', () => {
	let broker = new ServiceBroker({ logger: false });
	broker.createService(CustomerProtheus);
	const schema: ServiceSchema = {
		name: 'test-service'
	};

	let customerService: CustomerProtheus;

	const token: IGetToken = {
		access_token: 'fakeToken',
		refresh_token: '',
		scope: '',
		token_type: '',
		expires_in: 0
	};

	beforeEach(() => {
		customerService = new CustomerProtheus(broker, schema);
	});

	it('deve chamar a função getTokenUrlGlobal corretamente no método GetCustomer', async () => {
		const docNumber = '12345';

		(getTokenUrlGlobal as jest.Mock).mockResolvedValue(token);

		await customerService.GetCustomer(docNumber);

		expect(getTokenUrlGlobal).toHaveBeenCalledWith(
			'http://api5.protheus.viveo.prod:9117/rest11/api/oauth2/v1/token?grant_type=password&username=api_rest&password=52plQpl@ik'
		);
	});

	it('deve chamar a função AxiosRequestType corretamente no método GetCustomer', async () => {
		const docNumber = '12345';

		(getTokenUrlGlobal as jest.Mock).mockResolvedValue(token);

		const response = {};
		(AxiosRequestType as jest.Mock).mockResolvedValue(response);

		const result = await customerService.GetCustomer(docNumber);

		expect(result).toEqual(response);
	});
});
