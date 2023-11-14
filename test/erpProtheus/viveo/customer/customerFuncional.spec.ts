import { AxiosRequestType } from '../../../../services/library/axios';
import { IGetToken } from '../../../../src/interface/erpProtheus/global';
import {
	INewCustomersFuncional,
	TreatmentProtheus
} from '../../../../src/interface/funcional/customer/customersFuncional.interface';
import CustomersFuncionalService from '../../../../services/erpProtheus/viveo/customer/customersFuncional.service';
import { getTokenUrlGlobal } from '../../../../services/library/erpProtheus';
import { ServiceBroker, ServiceSchema } from 'moleculer';
import * as dotenv from 'dotenv';

dotenv.config();

jest.mock('../../../../services/library/erpProtheus', () => ({
	getTokenUrlGlobal: jest.fn()
}));

jest.mock('../../../../services/library/axios', () => ({
	AxiosRequestType: jest.fn()
}));

describe('::Testes ::CustomersFuncionalService', () => {
	let broker = new ServiceBroker({ logger: false });
	broker.createService(CustomersFuncionalService);
	const schema: ServiceSchema = {
		name: 'test-service'
	};

	let customersService: CustomersFuncionalService;

	const token: IGetToken = {
		access_token: 'fakeToken',
		refresh_token: '',
		scope: '',
		token_type: '',
		expires_in: 0
	};

	const ctxMessage: INewCustomersFuncional = {
		protheus: 'teste',
		urlObj: {}
	};

	beforeEach(() => {
		customersService = new CustomersFuncionalService(broker, schema);
	});

	it('deve chamar a função getTokenUrlGlobal corretamente no método CustomersGet', async () => {
		(getTokenUrlGlobal as jest.Mock).mockResolvedValue(token);

		await customersService.CustomersGet(ctxMessage);
		expect(getTokenUrlGlobal).toHaveBeenCalledWith(
			process.env.PROTHEUSVIVEO_BASEURLFUNCIONAL_VIVEO +
				process.env.PROTHEUSVIVEO_RESTFUNCIONAL +
				process.env.PROTHEUSVIVEO_URLTOKEN +
				process.env.PROTHEUSVIVEO_USER +
				process.env.PROTHEUSVIVEO_PASS
		);
	});
});
