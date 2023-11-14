import {
	ServiceBroker,
	ServiceSchema,
	Service as MoleculerService,
	Context,
	Errors
} from 'moleculer';
import * as dotenv from 'dotenv';
import { Action, Service } from 'moleculer-decorators';
import { ICustomersFuncional } from '../../.../../../src/interface/funcional/customer/customersFuncional.interface';
import { apmElasticConnect, loggerElastic } from '../../library/elasticSearch';

dotenv.config();

@Service({
	name: 'funcional.customer',
	group: 'flow-funcional'
})
export default class CustomersFuncionalService extends MoleculerService {
	responseFuncional: object;
	responseApi: any | object;
	indexName = 'flow-funcional-customers';
	isCode = '200';
	originLayer = 'funcional';
	serviceName = 'CustomersFuncionalService';

	public constructor(public broker: ServiceBroker, schema: ServiceSchema) {
		super(broker);
	}

	@Action({
		cache: false,
		rest: {
			method: 'GET',
			basePath: 'customers/',
			path: 'funcional/'
		},
		query: {
			groupId: { type: 'string', min: 2, max: 2 },
			pageNumber: { type: 'string', min: 2, max: 2 },
			pageSize: { type: 'string', min: 2, max: 2 }
		},
		name: 'funcional.customer',
		group: 'flow-funcional'
	})
	public async CustomersGet(ctxMessage: Context<ICustomersFuncional>) {
		try {
			this.responseApi = await this.broker.emit(
				'funcional.integration.get.customer',
				ctxMessage.params
			);

			this.responseApi.forEach((resGlobal: object) => {
				this.responseApi = resGlobal;
			});

			loggerElastic(
				this.indexName,
				this.isCode,
				this.originLayer,
				this.serviceName,
				JSON.stringify(ctxMessage.params),
				JSON.stringify(this.responseApi)
			);

			return this.responseApi;
		} catch (error) {
			loggerElastic(
				this.indexName,
				error.code,
				this.originLayer,
				this.serviceName,
				JSON.stringify(ctxMessage.params),
				JSON.stringify(error.message)
			);
			apmElasticConnect.captureError(new Error(error.message));
			throw new Errors.MoleculerRetryableError(error.message, error.code);
		}
	}
}
