import {
	Errors,
	ServiceBroker,
	ServiceSchema,
	Service as MoleculerService
} from 'moleculer';
import * as dotenv from 'dotenv';
import { Event, Service } from 'moleculer-decorators';
import { IMoneyOrdersFuncional } from '../../../src/interface/crmMoney/order/ordersFuncional.interface';

dotenv.config();

@Service({
	name: 'service.crmmoney.orders',
	group: 'flow-funcional'
})
export default class OrdersFuncionalService extends MoleculerService {
	public returnProtheus: any;

	public constructor(public broker: ServiceBroker, schema: ServiceSchema) {
		super(broker);
	}

	@Event({
		name: 'funcional.crmmoney.post.orders',
		group: 'flow-funcional'
	})
	public async OrdersPost(ctxMessage: IMoneyOrdersFuncional) {
		try {
			const ctx = ctxMessage;
			return {
				authorization: true,
				orders: [
					{
						companyID: '01',
						branchID: '001001',
						customerID: '000001',
						branchCustomer: '0001',
						sequenceAddress: '000',
						customerName: 'EMPRESA TESTE',
						preAuthorizationCode: '00000000000100000079',
						notifyEndpoint: 'https://endpointtonotify/orders',
						items: [
							{
								productEAN: '7890808100001',
								productCode: '208713',
								quantity: 1,
								price: 500.4
							},
							{
								productEAN: '7891000605349',
								productCode: '999029',
								quantity: 1,
								price: 340.55
							}
						]
					}
				]
			};
		} catch (error) {
			throw new Errors.MoleculerError(error.message, error.code);
		}
	}
}
