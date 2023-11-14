import * as dotenv from 'dotenv';
import {
	Errors,
	Service as MoleculerService,
	ServiceBroker,
	ServiceSchema
} from 'moleculer';
import { Event, Service } from 'moleculer-decorators';
import { ISendProductStock } from '../../../src/interface/climba/product/product.interface';
import { AxiosRequestType } from '../../library/axios';
import { apmElasticConnect, loggerElastic } from '../../library/elasticSearch';

dotenv.config();

@Service({
	name: 'stock-climba',
	group: 'climba-ecommerce'
})
export default class StockProductsClimba extends MoleculerService {
	public constructor(public broker: ServiceBroker, schema: ServiceSchema) {
		super(broker);
	}

	public indexName = 'flow-ecommerce-stock';
	public serviceName = 'patchstockClimba.service';
	public originLayer = 'climbaEcommerce';

	@Event({
		name: 'service.climba.stock.stockProducts',
		group: 'flow-climba'
	})
	public async stockProducts(message: ISendProductStock) {
		try {
			this.logger.info(
				'==============CLIMBA STOCK PRODUCTS=============='
			);

			apmElasticConnect.startTransaction(
				'IE V1 => Climba - PATCH Stock',
				'request'
			);
			const responseGetStock = await AxiosRequestType(
				process.env.URL_ECOMMERCE +
					`products/${message.id}/${message.id}`,
				message.updateStock,
				'patch',
				{ 'x-idcommerce-api-token': process.env.TOKEN_ECOMMERCE }
			);
			apmElasticConnect.endTransaction(responseGetStock);

			if (responseGetStock.status === 200) {
				this.logger.info('Estoque atualizado com sucesso');
			}

			loggerElastic(
				this.indexName,
				responseGetStock.status.toString(),
				this.originLayer,
				this.serviceName,
				process.env.URL_ECOMMERCE +
					`products/${message.id}/${message.id}`,
				JSON.stringify(responseGetStock)
			);
		} catch (error) {
			loggerElastic(
				this.indexName,
				error.code.toString(),
				this.originLayer,
				this.serviceName,
				JSON.stringify(message),
				JSON.stringify(error.message)
			);
			apmElasticConnect
				.setTransactionName(this.indexName)
				.captureError(new Error(error.message))
				.endTransaction();
		}
	}
}
