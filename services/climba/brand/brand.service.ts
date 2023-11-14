'use strict';
import {
	Errors,
	Service as MoleculerService,
	ServiceBroker,
	ServiceSchema
} from 'moleculer';
import { Event, Service } from 'moleculer-decorators';
import * as dotenv from 'dotenv';
import { IBrand } from '../../../src/interface/climba/brand/brand.interface';
import { AxiosRequestType } from '../../library/axios';
import { apmElasticConnect, loggerElastic } from '../../library/elasticSearch';

dotenv.config();
@Service({
	name: 'brand-climba',
	group: 'climba-ecommerce'
})
export default class PostBrandClimba extends MoleculerService {
	public constructor(public broker: ServiceBroker, schema: ServiceSchema) {
		super(broker);
	}

	public indexName = 'flow-ecommerce-brand';
	public serviceName = 'climba.brand.service';
	public originLayer = 'climbaEcommerce';

	public async started() {}
	@Event({
		name: 'service.climba.brand.postBrand',
		group: 'flow-climba'
	})
	public async PostBrand(message: IBrand) {
		this.logger.info(
			'==============CADASTRO DE MARCAS - ECOMMERCE=============='
		);
		try {
			let responseBrand;
			let myResponse: any;
			let status: string = '200';

			apmElasticConnect.startTransaction(
				'IE V1 => Climba - GET Brand',
				'request'
			);
			const responseGetBrand = await AxiosRequestType(
				process.env.URL_ECOMMERCE + `brands/${message.id}`,
				message,
				'get',
				{ 'x-idcommerce-api-token': process.env.TOKEN_ECOMMERCE }
			);
			apmElasticConnect.endTransaction(responseGetBrand);

			if (responseGetBrand.status == 200) {
				myResponse = `Marca ${message.name} já existe`;
			} else {
				responseBrand = await AxiosRequestType(
					process.env.URL_ECOMMERCE + `brands`,
					message,
					'post',
					{
						'x-idcommerce-api-token': process.env.TOKEN_ECOMMERCE
					}
				);

				if (responseBrand.status === 201) {
					myResponse = JSON.stringify(responseBrand.message);
				} else {
					myResponse = responseBrand.message;
					myResponse = JSON.stringify(myResponse?.response?.data);
				}
				status = '201';
			}

			loggerElastic(
				this.indexName,
				status.toString(),
				this.originLayer,
				this.serviceName,
				`${process.env.URL_ECOMMERCE} - Body: ${JSON.stringify(
					message
				)}`,
				JSON.stringify(myResponse)
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
			throw new Errors.MoleculerError(error.message, error.code);
		}
	}
}
