'use strict';

import {
	Errors,
	Service as MoleculerService,
	ServiceBroker,
	ServiceSchema
} from 'moleculer';
import { Event, Service } from 'moleculer-decorators';
import * as dotenv from 'dotenv';
import {
	apmElasticConnect,
	loggerElastic
} from '../../../library/elasticSearch';
import { CronJob } from 'cron';
import { IGetToken } from '../../../../src/interface/erpProtheus/global';
import { getTokenUrlGlobal } from '../../../library/erpProtheus';
import { AxiosRequestType } from '../../../library/axios';
import { EcommerceProductIntegrationRepository } from '../../../../src/repository/integration/product/ecommerce.repository';
import {
	IProductStock,
	ISendProductStock
} from '../../../../src/interface/climba/product/product.interface';

dotenv.config();
@Service({
	name: 'ecommerce.erpprotheusviveo.stockProductEcommerce',
	group: 'flow-climba'
})
export default class StockProductsEcommerce extends MoleculerService {
	static AxiosRequestType: jest.Mock<any, any, any>;
	public constructor(public broker: ServiceBroker, schema: ServiceSchema) {
		super(broker);

		this.cronJobOne = new CronJob(
			process.env.CRON_STOCK_PRODUCT,
			async () => {
				try {
					this.broker.broadcast(
						'service.erpProtheusViveo.stock.getstockproductecommerce',
						process.env.PROTHEUS_STOCKPRODUCT_ATIVE
					);
				} catch {
					new Error('Cron not run');
				}
			}
		);

		if (!this.cronJobOne.running) this.cronJobOne.start();
	}

	public indexName = 'flow-ecommerce-stockproducts';
	public serviceName = 'erpProtheus.stock.service';
	public originLayer = 'erpprotheusviveo';

	@Event({
		name: 'service.erpProtheusViveo.stock.getstockproductecommerce',
		group: 'flow-climba'
	})
	public async GetStockProductEcommercer(enabled: string) {
		if (enabled === 'true') {
			try {
				this.logger.info(
					'==============BUSCA STOCK PRODUCTs PROTHEUS=============='
				);
				const token: IGetToken = await getTokenUrlGlobal(
					process.env.PROTHEUSVIVEO_BASEURL_BELLACOTTON +
						'11' +
						process.env.PROTHEUSVIVEO_URLTOKEN +
						process.env.PROTHEUSVIVEO_USER +
						process.env.PROTHEUSVIVEO_PASS
				);

				const repository = EcommerceProductIntegrationRepository;

				const products =
					await repository.GetEcommerceProductSuccessIntegration();

				for (const product of products) {
					if (token.access_token) {
						const getStockProduct = await AxiosRequestType(
							process.env.PROTHEUSVIVEO_BASEURL_BELLACOTTON +
								'11/BellaCottonIntegration/api/v2/saldoProduto',
							'',
							'get',
							{
								Authorization: 'Bearer ' + token.access_token,
								TenantId: '11,001043'
							},
							{
								Filter: `Stock eq 'ECOM' and Quantity gt 0 and ProductCode eq '${product.productId}'`
							}
						);

						let status: string;
						if (getStockProduct.status === 200) {
							status = '200';
							if (getStockProduct.message.total == 1) {
								const quantityStock: IProductStock = {
									quantity:
										getStockProduct.message.data.Quantity
								};

								const sendProduct: ISendProductStock = {
									updateStock: quantityStock,
									id: getStockProduct.message.data.ProductCode
								};

								await this.broker.broadcast(
									'ecommerce.integration.stockproducts',
									sendProduct
								);
							} else if (getStockProduct.message.total > 1) {
								for (const stockProduct of getStockProduct
									.message.data) {
									const quantityStock: IProductStock = {
										quantity: stockProduct.Quantity
									};

									const sendProduct: ISendProductStock = {
										updateStock: quantityStock,
										id: stockProduct.ProductCode
									};

									await this.broker.broadcast(
										'ecommerce.integration.stockproducts',
										sendProduct
									);
								}
							}
						} else {
							status = '400';
						}

						loggerElastic(
							this.indexName,
							status,
							this.originLayer,
							this.serviceName,
							process.env.PROTHEUSVIVEO_BASEURL_BELLACOTTON +
								'11/BellaCottonIntegration/api/v2/categories',
							JSON.stringify(getStockProduct)
						);
					}
				}
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
				throw new Errors.MoleculerError(error.message, error.code);
			}
		}
	}
}
