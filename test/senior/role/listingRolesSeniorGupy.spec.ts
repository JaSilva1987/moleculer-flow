import { ServiceBroker } from 'moleculer';
import ListingRolesService from '../../../services/senior/role/listingRolesSeniorGupy.service';

describe('Teste unitário para ListingRolesService', () => {
	let broker: ServiceBroker;
	let listingRolesService: ListingRolesService;

	beforeEach(() => {
		broker = new ServiceBroker({ logger: false });
		broker.createService(ListingRolesService);
		listingRolesService = new ListingRolesService(broker);
	});

	afterEach(async () => {
		await broker.stop();
	});

	it('deve criar uma instância da classe ListingRolesService corretamente', () => {
		expect(listingRolesService).toBeInstanceOf(ListingRolesService);
	});

	it('deve chamar o método GetListingRolesSeniorGupy corretamente', async () => {
		const mockContext: any = {
			params: {
				id: 12,
				name: 'Mock Teste',
				code: '50'
			}
		};

		const result = await listingRolesService.GetListingRolesSeniorGupy(
			mockContext
		);

		expect(result).not.toBeDefined();
		expect(result).not.toBeNull();
	});
});
