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
import { ICategory } from '../../../src/interface/climba/categories/categories.interface';

dotenv.config();
@Service({
	name: 'categories-climba',
	group: 'climba-ecommerce'
})
export default class PostcategoriesClimba extends MoleculerService {
	public constructor(public broker: ServiceBroker, schema: ServiceSchema) {
		super(broker);
	}

	public indexName = 'flow-ecommerce-categories';
	public serviceName = 'climba.category.service';
	public originLayer = 'climbaEcommerce';

	@Event({
		name: 'service.climba.categories.postcategories',
		group: 'flow-climba'
	})
	public async PostCategories(message: ICategory) {
		this.logger.info(
			'==============CADASTRO DE CATEGORIES - ECOMMERCE=============='
		);
		try {
			let responseCategories;
			let myResponse: any;
			let status: string = '200';

			apmElasticConnect.startTransaction(
				'IE V1 => Climba - GET Categories',
				'request'
			);
			const responseGetcategories = await AxiosRequestType(
				process.env.URL_ECOMMERCE + `categories/${message.id}`,
				message,
				'get',
				{ 'x-idcommerce-api-token': process.env.TOKEN_ECOMMERCE }
			);
			apmElasticConnect.endTransaction(responseGetcategories);

			if (responseGetcategories.status == 200) {
				myResponse = `Categoria ${message.name} já existe`;
			} else {
				responseCategories = await AxiosRequestType(
					process.env.URL_ECOMMERCE + `categories`,
					message,
					'post',
					{
						'x-idcommerce-api-token': process.env.TOKEN_ECOMMERCE
					}
				);

				if (responseCategories.status == 201) {
					myResponse = JSON.stringify(responseCategories.message);
				} else {
					myResponse = responseCategories.message;
					myResponse = JSON.stringify(myResponse?.response?.data);
				}
				status = '201';
			}

			loggerElastic(
				this.indexName,
				status,
				this.originLayer,
				this.serviceName,
				`${process.env.URL_ECOMMERCE} - Body: ${JSON.stringify(
					message
				)}`,
				myResponse
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
