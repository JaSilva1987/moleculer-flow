import * as dotenv from 'dotenv';
import {
	Service as MoleculerService,
	ServiceBroker,
	ServiceSchema
} from 'moleculer';
import { Event, Service } from 'moleculer-decorators';
import { ISendProductStock } from '../../../src/interface/climba/product/product.interface';
import { IStockEcommerceIntegration } from '../../../src/interface/integration/stock/stockEcommerce.interface';
import { StockEcommerceIntegrationRepository } from '../../../src/repository/integration/stock/stockEcommerce.repository';
import { apmElasticConnect, loggerElastic } from '../../library/elasticSearch';

dotenv.config();

@Service({
	name: 'service.integration.stock.stockecommerce',
	group: 'flow-climba'
})
export default class StockProductsEcommerceService extends MoleculerService {
	public constructor(public broker: ServiceBroker, schema: ServiceSchema) {
		super(broker);
	}

	public indexName = 'flow-ecommerce-stockproducts';
	public serviceName = 'integration.stockproducts.service';
	public originLayer = 'integration';

	@Event({
		name: 'ecommerce.integration.stockproducts',
		group: 'flow-climba'
	})
	public async stockProducts(message: ISendProductStock) {
		try {
			this.logger.info(
				'==============STOCK PRODUTOS INTEGRATION=============='
			);

			let response: any;
			let sendJson: boolean = false;
			const repository = StockEcommerceIntegrationRepository;

			const dataStockProduct: IStockEcommerceIntegration = {
				productId: message.id,
				quantity: message.updateStock.quantity,
				createdAt: new Date(),
				updatedAt: new Date()
			};

			const existStockProduct =
				await repository.GetStockEcommerceIntegration(message.id);

			if (existStockProduct.length > 0) {
				if (
					existStockProduct[0].quantity !=
					message.updateStock.quantity
				) {
					response = await repository.PutStockEcommerceIntegration(
						dataStockProduct,
						existStockProduct[0].id
					);

					sendJson = true;
				}
			} else {
				response = await repository.PostStockEcommerceIntegration(
					dataStockProduct
				);

				sendJson = true;
			}

			if (sendJson === true) {
				await this.broker.broadcast(
					'service.climba.stock.stockProducts',
					message
				);
			}
		} catch (error) {
			loggerElastic(
				this.indexName,
				'499',
				this.originLayer,
				this.serviceName,
				JSON.stringify('Busca ordem com erros para reenvio'),
				JSON.stringify(error.message)
			);
			apmElasticConnect
				.setTransactionName(this.indexName)
				.captureError(new Error(error.message))
				.endTransaction();
		}
	}
}
