import { ServiceBroker } from 'moleculer';
import CustomFieldsService from '../../../services/senior/job/customFieldSeniorGupy.service';

describe('Teste unitário para CustomFieldsService', () => {
	let broker: ServiceBroker;
	let customFieldsService: CustomFieldsService;

	beforeEach(() => {
		broker = new ServiceBroker({ logger: false });
		broker.createService(CustomFieldsService);
		customFieldsService = new CustomFieldsService(broker);
	});

	afterEach(async () => {
		await broker.stop();
	});

	it('deve criar uma instância da classe CustomFieldsService corretamente', () => {
		expect(customFieldsService).toBeInstanceOf(CustomFieldsService);
	});

	it('deve chamar o método GetCustomFieldsSeniorGupy corretamente', async () => {
		const mockContext: any = {
			params: { id: 1, label: 'Teste' }
		};

		const result = await customFieldsService.GetCustomFieldsSeniorGupy(
			mockContext
		);

		expect(result).toBeUndefined();
	});
});
