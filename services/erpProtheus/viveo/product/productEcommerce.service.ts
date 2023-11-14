'use strict';

import { CronJob } from 'cron';
import { format, sub } from 'date-fns';
import * as dotenv from 'dotenv';
import {
	Errors,
	Service as MoleculerService,
	ServiceBroker,
	ServiceSchema
} from 'moleculer';
import { Event, Service } from 'moleculer-decorators';
import { IAttribute } from '../../../../src/interface/climba/attribute/attribute.interface';
import { IProduct } from '../../../../src/interface/climba/product/product.interface';
import { IProductVariants } from '../../../../src/interface/climba/product/productVariant.interface';
import { IProductVariantPrice } from '../../../../src/interface/climba/product/productVariantPrice.interface';
import { IGetToken } from '../../../../src/interface/erpProtheus/global';
import { AxiosRequestType } from '../../../library/axios';
import { convertValue } from '../../../library/convert/convertValue';
import {
	apmElasticConnect,
	loggerElastic
} from '../../../library/elasticSearch';
import { getTokenUrlGlobal } from '../../../library/erpProtheus';

dotenv.config();
@Service({
	name: 'ecommerce.erpprotheusviveo.products',
	group: 'flow-climba'
})
export default class PoolProduct extends MoleculerService {
	public constructor(public broker: ServiceBroker, schema: ServiceSchema) {
		super(broker);

		this.cronJobOne = new CronJob(process.env.CRON_PRODUCT, async () => {
			try {
				this.broker.broadcast(
					'service.erpProtheusViveo.productecommerce.getproduct',
					process.env.PROTHEUS_PRODUCT_ATIVE
				);
			} catch {
				new Error('Cron not run');
			}
		});

		if (!this.cronJobOne.running) this.cronJobOne.start();
	}

	public indexName = 'flow-ecommerce-product';
	public serviceName = 'erpProtheusViveo.products.service';
	public originLayer = 'erpprotheusviveo';

	@Event({
		name: 'service.erpProtheusViveo.productecommerce.getproduct',
		group: 'flow-climba'
	})
	public async GetCategories(enabled: string) {
		if (enabled === 'true') {
			try {
				this.logger.info(
					'==============BUSCA PRODUCTS PROTHEUS=============='
				);

				const token: IGetToken = await getTokenUrlGlobal(
					process.env.PROTHEUSVIVEO_BASEURL_BELLACOTTON +
						'11' +
						process.env.PROTHEUSVIVEO_URLTOKEN +
						process.env.PROTHEUSVIVEO_USER +
						process.env.PROTHEUSVIVEO_PASS
				);

				if (token.access_token) {
					const nowDate = new Date();
					const endDate = format(nowDate, 'yyyy-MM-dd');
					const endHour = format(nowDate, 'HH:mm:ss');
					const startDate = format(
						sub(nowDate, { minutes: 120 }),
						'yyyy-MM-dd'
					);
					const startHour = format(
						sub(nowDate, { minutes: 120 }),
						'HH:mm:ss'
					);

					const getEcommercesBrands = await AxiosRequestType(
						process.env.PROTHEUSVIVEO_BASEURL_BELLACOTTON +
							'11/BellaCottonIntegration/api/v2/getEcommercesXlabels',
						'',
						'get',
						{ Authorization: 'Bearer ' + token.access_token },
						{ Filter: 'eCommerce=["BELLACOTTON"]' }
					);

					if (getEcommercesBrands.status == 200) {
						let marcas: string[] = [];
						for (const getEcommerce of getEcommercesBrands.message
							.data) {
							marcas.push('"' + getEcommerce.Marca + '"');
						}

						const getBrands = await AxiosRequestType(
							process.env.PROTHEUSVIVEO_BASEURL_BELLACOTTON +
								'11/BellaCottonIntegration/api/v2/labels',
							'',
							'get',
							{ Authorization: 'Bearer ' + token.access_token },
							{ Filter: 'descricaoMarca=[' + marcas + ']' }
						);

						if (getBrands.status == 200) {
							for (const getBrand of getBrands.message.data) {
								const getProduct: any = await AxiosRequestType(
									process.env
										.PROTHEUSVIVEO_BASEURL_BELLACOTTON +
										'11/BellaCottonIntegration/api/v2/products',
									'',
									'get',
									{
										Authorization:
											'Bearer ' + token.access_token,
										TenantId: '11,001043'
									},
									{
										PageSize: 150,
										Filter: `eCommerce eq '1' and status eq '2' and updated_date ge '${startDate}' and updated_date le '${endDate}' and updated_time ge '${startHour}' and updated_time le '${endHour}' and brandId eq '${getBrand.codigoMarca}'`
									}
								);

								if (getProduct.status == 200) {
									//Os atributos são fixos
									const mockAttributeCor: IAttribute = {
										id: '1',
										name: 'Default',
										attributeGroupId: '1'
									};

									const mockAttributeTamanho: IAttribute = {
										id: '2',
										name: 'Default',
										attributeGroupId: '2'
									};

									const priceList: IProductVariantPrice = {
										priceListId: '1',
										price: 1,
										priceFrom: 0
									};

									const mockAttribute: IAttribute[] = [];
									mockAttribute.push(mockAttributeCor);
									mockAttribute.push(mockAttributeTamanho);

									if (getProduct.message?.total == 1) {
										const product =
											getProduct.message?.products;

										const productVariant: IProductVariants =
											{
												sku:
													product.productVariants[0]
														.sku || product.id,
												manufacturerCode:
													product.productVariants[0]
														.sku,
												attributes: mockAttribute,
												quantity: 0,
												typeSalesUnit:
													product.productVariants[0]
														.typeSalesUnit,
												description:
													product.productVariants[0]
														.description,
												grossWeight:
													(await convertValue(
														product
															.productVariants[0]
															.grossWeight,
														'weight'
													)) || 0,
												netWeight:
													(await convertValue(
														product
															.productVariants[0]
															.netWeight,
														'weight'
													)) || 0,
												height:
													(await convertValue(
														product
															.productVariants[0]
															.height,
														'measure'
													)) || 0,
												width:
													(await convertValue(
														product
															.productVariants[0]
															.width,
														'measure'
													)) || 0,
												length:
													(await convertValue(
														product
															.productVariants[0]
															.length,
														'measure'
													)) || 0,
												barCode:
													product.productVariants[0]
														.barCode,
												productOrigin:
													product.productVariants[0]
														.productOrigin,
												ipi: product.productVariants[0]
													.ipi,
												prices: [priceList]
											};

										const sendProduct: IProduct = {
											id: product.id,
											status: 1,
											categories: [
												product.categories[0].id || '0'
											],
											brandId: product.brandId,
											name: product.name,
											description: product.description,
											productVariants: [productVariant],
											videos: [],
											shortDescription: product.name
										};

										await this.broker.broadcast(
											'ecommerce.integration.products',
											sendProduct
										);
									} else if (getProduct.message.total > 1) {
										for (const product of getProduct.message
											.products) {
											const productVariant: IProductVariants =
												{
													sku:
														product
															.productVariants[0]
															.sku || product.id,
													manufacturerCode:
														product
															.productVariants[0]
															.sku,
													attributes: mockAttribute,
													quantity: 0,
													typeSalesUnit:
														product
															.productVariants[0]
															.typeSalesUnit,
													description:
														product
															.productVariants[0]
															.description,
													grossWeight:
														(await convertValue(
															product
																.productVariants[0]
																.grossWeight,
															'weight'
														)) || 0,
													netWeight:
														(await convertValue(
															product
																.productVariants[0]
																.netWeight,
															'weight'
														)) || 0,
													height:
														(await convertValue(
															product
																.productVariants[0]
																.height,
															'measure'
														)) || 0,
													width:
														(await convertValue(
															product
																.productVariants[0]
																.width,
															'measure'
														)) || 0,
													length:
														(await convertValue(
															product
																.productVariants[0]
																.length,
															'measure'
														)) || 0,
													barCode:
														product
															.productVariants[0]
															.barCode,
													productOrigin:
														product
															.productVariants[0]
															.productOrigin,
													ipi: product
														.productVariants[0].ipi,
													prices: [priceList]
												};

											const sendProduct: IProduct = {
												id: product.id,
												status: 1,
												categories: [
													product.categories[0]?.id ||
														'0'
												],
												brandId: product.brandId,
												name: product.name,
												description:
													product.description,
												productVariants: [
													productVariant
												],
												videos: [],
												shortDescription: product.name
											};

											await this.broker.broadcast(
												'ecommerce.integration.products',
												sendProduct
											);
										}
									}
								}
							}
						}
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
			}
		}
	}
}
