import * as dotenv from 'dotenv';
import {
	Service as MoleculerService,
	ServiceBroker,
	ServiceSchema
} from 'moleculer';
import { Event, Service } from 'moleculer-decorators';
import { statusEcommerceIntegration } from '../../../src/enum/integration/statusEcommerceProducts.enum';
import {
	IProduct,
	ISendProduct
} from '../../../src/interface/climba/product/product.interface';
import { IEcommerceProductIntegration } from '../../../src/interface/integration/product/EcommerceProduct.interface';
import { EcommerceProductIntegrationRepository } from '../../../src/repository/integration/product/ecommerce.repository';
import { apmElasticConnect, loggerElastic } from '../../library/elasticSearch';

dotenv.config();

@Service({
	name: 'service.integrationecommerce.products',
	group: 'flow-climba'
})
export default class ProductsEcommerceService extends MoleculerService {
	public constructor(public broker: ServiceBroker, schema: ServiceSchema) {
		super(broker);
	}

	public indexName = 'flow-ecommerce-product';
	public serviceName = 'integration.product.service';
	public originLayer = 'integration';

	@Event({
		name: 'ecommerce.integration.products',
		group: 'flow-climba'
	})
	public async productsEcommerce(message: IProduct) {
		try {
			this.logger.info(
				'==============INTEGRATION PRODUCTS=============='
			);
			let response;
			const repository = EcommerceProductIntegrationRepository;

			const productIntegration: IEcommerceProductIntegration = {
				productId: message.id,
				productSku: message.productVariants[0].sku,
				nameProduct: message.name,
				IPI: message.productVariants[0].ipi,
				originProduct: message.productVariants[0].productOrigin,
				JSON: JSON.stringify(message),
				status: statusEcommerceIntegration.toIntegration,
				createdAt: new Date(),
				updatedAt: new Date()
			};

			const existProduct =
				await repository.GetEcommerceProductIntegration(
					productIntegration.productId,
					productIntegration.productSku
				);

			let status: string;

			if (existProduct.length > 0) {
				if (
					existProduct[0].status != statusEcommerceIntegration.success
				) {
					response = await repository.PutEcommerceProductIntegration(
						productIntegration,
						existProduct[0].id
					);
				}
				status = existProduct[0].status;
			} else {
				response = await repository.PostEcommerceProductIntegration(
					productIntegration
				);

				status = statusEcommerceIntegration.toIntegration;
			}

			const sendProduct: ISendProduct = {
				product: message,
				dataProduct: productIntegration
			};

			if (status != statusEcommerceIntegration.success) {
				await this.broker.broadcast(
					'service.climba.products.postproducts',
					sendProduct
				);
			}

			loggerElastic(
				this.indexName,
				'200',
				this.originLayer,
				this.serviceName,
				JSON.stringify(message),
				JSON.stringify(response)
			);
		} catch (error) {
			loggerElastic(
				this.indexName,
				'499',
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
