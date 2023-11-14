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
import { IBrand } from '../../../../src/interface/climba/brand/brand.interface';
import { getTokenUrlGlobal } from '../../../library/erpProtheus';
import { IGetToken } from '../../../../src/interface/erpProtheus/global';
import { AxiosRequestType } from '../../../library/axios';

dotenv.config();
@Service({
	name: 'ecommerce.erpprotheusviveo.brand',
	group: 'flow-climba'
})
export default class PoolBrand extends MoleculerService {
	public constructor(public broker: ServiceBroker, schema: ServiceSchema) {
		super(broker);

		this.cronJobOne = new CronJob(process.env.CRON_BRAND, async () => {
			try {
				this.broker.broadcast(
					'service.erpProtheusViveo.brands.getbrands',
					process.env.PROTHEUS_BRAND_ATIVE
				);
			} catch {
				new Error('Cron not run');
			}
		});

		if (!this.cronJobOne.running) this.cronJobOne.start();
	}

	public indexName = 'flow-ecommerce-brand';
	public serviceName = 'erpProtheusViveo.brand.service';
	public originLayer = 'erpprotheusviveo';

	@Event({
		name: 'service.erpProtheusViveo.brands.getbrands',
		group: 'flow-climba'
	})
	public async GetBrands(enabled: string) {
		if (enabled === 'true') {
			try {
				this.logger.info(
					'==============BUSCA BRANDS PROTHEUS=============='
				);

				const token: IGetToken = await getTokenUrlGlobal(
					process.env.PROTHEUSVIVEO_BASEURL_BELLACOTTON +
						'11' +
						process.env.PROTHEUSVIVEO_URLTOKEN +
						process.env.PROTHEUSVIVEO_USER +
						process.env.PROTHEUSVIVEO_PASS
				);

				if (token.access_token) {
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
							for (const brand of getBrands.message.data) {
								const dataBrand: IBrand = {
									id: brand.codigoMarca,
									name: brand.descricaoMarca,
									description: ''
								};

								await this.broker.broadcast(
									'service.climba.brand.postBrand',
									dataBrand
								);
							}
						}

						loggerElastic(
							this.indexName,
							getBrands.status.toString(),
							this.originLayer,
							this.serviceName,
							process.env.PROTHEUSVIVEO_BASEURL_BELLACOTTON +
								'11/BellaCottonIntegration/api/v2/labels',
							JSON.stringify(getBrands)
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
