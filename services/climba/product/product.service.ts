'use strict';
import {
	Errors,
	Service as MoleculerService,
	ServiceBroker,
	ServiceSchema
} from 'moleculer';
import { Event, Service } from 'moleculer-decorators';
import * as dotenv from 'dotenv';
import { AxiosRequestType } from '../../library/axios';
import { apmElasticConnect, loggerElastic } from '../../library/elasticSearch';
import { ISendProduct } from '../../../src/interface/climba/product/product.interface';
import { EcommerceProductIntegrationRepository } from '../../../src/repository/integration/product/ecommerce.repository';
import { statusEcommerceIntegration } from '../../../src/enum/integration/statusEcommerceProducts.enum';

dotenv.config();
@Service({
	name: 'products-climba',
	group: 'climba-ecommerce'
})
export default class PostProductsClimba extends MoleculerService {
	postProductsClimba: { info: jest.Mock<any, any, any> };
	public constructor(public broker: ServiceBroker, schema: ServiceSchema) {
		super(broker);
	}

	public indexName = 'flow-ecommerce-product';
	public serviceName = 'climba.product.service';
	public originLayer = 'climbaEcommerce';

	@Event({
		name: 'service.climba.products.postproducts',
		group: 'flow-climba'
	})
	public async PostProducts(message: ISendProduct) {
		this.logger.info(
			'==============CADASTRO DE PRODUCTS - ECOMMERCE=============='
		);
		try {
			let responseProducts;

			apmElasticConnect.startTransaction(
				'IE V1 => Climba - GET Products',
				'request'
			);
			const responseGetProducts = await AxiosRequestType(
				process.env.URL_ECOMMERCE + `products/${message.product.id}`,
				message.product,
				'get',
				{ 'x-idcommerce-api-token': process.env.TOKEN_ECOMMERCE }
			);
			apmElasticConnect.endTransaction(responseGetProducts);

			if (responseGetProducts.status == 200) {
				apmElasticConnect.startTransaction(
					'IE V1 => Climba - PUT Products',
					'request'
				);
				responseProducts = await AxiosRequestType(
					process.env.URL_ECOMMERCE +
						`products/${message.product.id}`,
					message.product,
					'put',
					{ 'x-idcommerce-api-token': process.env.TOKEN_ECOMMERCE }
				);
				apmElasticConnect.endTransaction(responseProducts);
			} else {
				apmElasticConnect.startTransaction(
					'IE V1 => Climba - POST Products',
					'request'
				);
				responseProducts = await AxiosRequestType(
					process.env.URL_ECOMMERCE + `products`,
					message.product,
					'post',
					{ 'x-idcommerce-api-token': process.env.TOKEN_ECOMMERCE }
				);
				apmElasticConnect.endTransaction(responseProducts);
			}

			let myResponse: any;
			let response: any;
			const repository = EcommerceProductIntegrationRepository;

			if (
				responseProducts.status == 200 ||
				responseProducts.status == 201
			) {
				myResponse = JSON.stringify(responseProducts.message);
				message.dataProduct.status = statusEcommerceIntegration.success;
			} else {
				myResponse = JSON.stringify(responseProducts.message);
				message.dataProduct.status = `${statusEcommerceIntegration.erro} - ${myResponse}`;
			}

			const existProduct =
				await repository.GetEcommerceProductIntegration(
					message.dataProduct.productId,
					message.dataProduct.productSku
				);

			if (existProduct.length > 0) {
				response = await repository.PutEcommerceProductIntegration(
					message.dataProduct,
					existProduct[0].id
				);
			}

			loggerElastic(
				this.indexName,
				responseProducts.status.toString() || '200',
				this.originLayer,
				this.serviceName,
				`${process.env.URL_ECOMMERCE} - Body: ${JSON.stringify(
					message.product
				)}`
			);
		} catch (error) {
			loggerElastic(
				this.indexName,
				'499',
				this.originLayer,
				this.serviceName,
				JSON.stringify(error.message)
			);

			apmElasticConnect
				.setTransactionName(this.indexName)
				.captureError(new Error(error.message))
				.endTransaction();
		}
	}
}
