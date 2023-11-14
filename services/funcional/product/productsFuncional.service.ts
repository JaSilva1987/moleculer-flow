import {
	ServiceBroker,
	ServiceSchema,
	Service as MoleculerService,
	Context,
	Errors
} from 'moleculer';
import * as dotenv from 'dotenv';
import { Action, Service } from 'moleculer-decorators';
import { IProductsFuncional } from '../../../src/interface/funcional/product/productsFuncional.interface';
import { apmElasticConnect, loggerElastic } from '../../library/elasticSearch';

dotenv.config();

@Service({
	name: 'funcional.products',
	group: 'flow-funcional'
})
export default class ProductsFuncionalService extends MoleculerService {
	responseFuncional: object;
	responseApi: any;
	indexName = 'flow-funcional-products';
	isCode = '200';
	originLayer = 'funcional';
	serviceName = 'ProductsFuncionalService';

	public constructor(public broker: ServiceBroker, schema: ServiceSchema) {
		super(broker);
	}

	@Action({
		cache: false,
		rest: {
			method: 'GET',
			basePath: 'products/',
			path: 'funcional/'
		},
		query: {
			groupId: { type: 'string', min: 2, max: 2 },
			productEAN: { type: 'string', min: 1 },
			pageNumber: { type: 'string', min: 2, max: 2 },
			pageSize: { type: 'string', min: 1 },
			internalCode: { type: 'string', min: 1 }
		},
		name: 'funcional.products',
		group: 'flow-funcional'
	})
	public async ProductsGet(ctxMessage: Context<IProductsFuncional>) {
		try {
			this.responseApi = await this.broker.emit(
				'funcional.integration.get.products',
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
			throw new Errors.MoleculerError(error.message, error.code);
		}
	}
}
