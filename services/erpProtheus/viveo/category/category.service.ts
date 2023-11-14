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
import { ICategory } from '../../../../src/interface/climba/categories/categories.interface';
import { CronJob } from 'cron';
import { IGetToken } from '../../../../src/interface/erpProtheus/global';
import { getTokenUrlGlobal } from '../../../library/erpProtheus';
import { AxiosRequestType } from '../../../library/axios';

dotenv.config();
@Service({
	name: 'ecommerce.erpprotheusviveo.category',
	group: 'flow-climba'
})
export default class PoolCategories extends MoleculerService {
	public constructor(public broker: ServiceBroker, schema: ServiceSchema) {
		super(broker);

		this.cronJobOne = new CronJob(process.env.CRON_CATEGORY, async () => {
			try {
				this.broker.broadcast(
					'service.erpProtheusViveo.category.getcategories',
					process.env.PROTHEUS_CATEGORY_ATIVE
				);
			} catch {
				new Error('Cron not run');
			}
		});

		if (!this.cronJobOne.running) this.cronJobOne.start();
	}

	public indexName = 'flow-ecommerce-categories';
	public serviceName = 'erpProtheusViveo.category.service';
	public originLayer = 'erpprotheusviveo';

	@Event({
		name: 'service.erpProtheusViveo.category.getcategories',
		group: 'flow-climba'
	})
	public async GetCategories(enabled: string) {
		if (enabled === 'true') {
			try {
				this.logger.info(
					'==============BUSCA CATEGORIES PROTHEUS=============='
				);

				const token: IGetToken = await getTokenUrlGlobal(
					process.env.PROTHEUSVIVEO_BASEURL_BELLACOTTON +
						'11' +
						process.env.PROTHEUSVIVEO_URLTOKEN +
						process.env.PROTHEUSVIVEO_USER +
						process.env.PROTHEUSVIVEO_PASS
				);

				if (token.access_token) {
					const getCategories = await AxiosRequestType(
						process.env.PROTHEUSVIVEO_BASEURL_BELLACOTTON +
							'11/BellaCottonIntegration/api/v2/categories',
						'',
						'get',
						{ Authorization: 'Bearer ' + token.access_token }
					);

					if (getCategories.status == 200) {
						for (const category of getCategories.message.data) {
							const dataCategory: ICategory = {
								id: category.id,
								parentId: category.parentId,
								name: category.description,
								description: category.description,
								order: category.order
							};

							await this.broker.broadcast(
								'service.climba.categories.postcategories',
								dataCategory
							);
						}

						loggerElastic(
							this.indexName,
							getCategories.status.toString(),
							this.originLayer,
							this.serviceName,
							process.env.PROTHEUSVIVEO_BASEURL_BELLACOTTON +
								'11/BellaCottonIntegration/api/v2/categories',
							JSON.stringify(getCategories)
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
