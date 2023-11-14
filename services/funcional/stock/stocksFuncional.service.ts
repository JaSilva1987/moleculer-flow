import {
	ServiceBroker,
	ServiceSchema,
	Service as MoleculerService,
	Context,
	Errors
} from 'moleculer';
import * as dotenv from 'dotenv';
import { Action, Service } from 'moleculer-decorators';
import { IStocksFuncional } from '../../../src/interface/funcional/stock/stocksFuncional.interface';

dotenv.config();

@Service({
	name: 'funcional.stocks',
	group: 'flow-funcional'
})
export default class ProductsFuncionalService extends MoleculerService {
	responseFuncional: object;
	responseApi: any;

	public constructor(public broker: ServiceBroker, schema: ServiceSchema) {
		super(broker);
	}

	@Action({
		cache: false,
		rest: {
			method: 'GET',
			basePath: 'stocks/',
			path: 'funcional/'
		},
		query: {
			groupId: { type: 'string', min: 2, max: 2 },
			codeEAN: { type: 'string', min: 1 },
			pageNumber: { type: 'string', min: 2, max: 2 },
			pageSize: { type: 'string', min: 1 },
			productEAN: { type: 'string', min: 1 },
			internalCode: { type: 'string', min: 1 }
		},
		name: 'funcional.stocks',
		group: 'flow-funcional'
	})
	public async StocksGet(ctxMessage: Context<IStocksFuncional>) {
		try {
			this.responseApi = await this.broker.emit(
				'funcional.integration.get.stocks',
				ctxMessage.params
			);

			this.responseApi.forEach((resGlobal: object) => {
				this.responseApi = resGlobal;
			});

			return this.responseApi;
		} catch (error) {
			throw new Errors.MoleculerError(error.message, error.code);
		}
	}
}
