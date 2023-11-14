import {
	Errors,
	Service as MoleculerService,
	ServiceBroker,
	ServiceSchema
} from 'moleculer';
import { Event, Method, Service } from 'moleculer-decorators';

@Service({
	name: 'service-crmiso-order-billingOrder',
	group: 'flow-cremmer'
})
export default class BillingOrder extends MoleculerService {
	public constructor(public broker: ServiceBroker, schema: ServiceSchema) {
		super(broker);
	}

	@Event({
		name: 'service-integration-order-generateBillingOrder',
		group: 'flow-cremmer'
	})
	public async GenerateBillingOrder(ctx: any) {
		try {
			await this.methodBillingOrder(ctx.params);
		} catch (err) {
			throw new Errors.MoleculerRetryableError(err.message, err.code);
		}
	}

	@Method
	public async methodBillingOrder(message: any) {}
}
