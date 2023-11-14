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
import { IAttribute } from '../../../src/interface/climba/attribute/attribute.interface';

dotenv.config();
@Service({
	name: 'attributes-climba',
	group: 'climba-ecommerce'
})
export default class PostAttributesClimba extends MoleculerService {
	public constructor(public broker: ServiceBroker, schema: ServiceSchema) {
		super(broker);
	}

	public indexName = 'flow-ecommerce-attribute';
	public serviceName = 'climba.attributes.service';
	public originLayer = 'climbaEcommerce';

	public async started() {}
	@Event({
		name: 'service.climba.attribute.PostAttributes',
		group: 'flow-climba'
	})
	public async PostAttributes(message: IAttribute) {
		this.logger.info(
			'==============CADASTRO DE ATTRIBUTOS - ECOMMERCE=============='
		);
		try {
			let responseAttributes;

			const responseGetAttributes = await AxiosRequestType(
				process.env.URL_ECOMMERCE +
					`attributes/${message.attributeGroupId}/${message.id}`,
				message,
				'get',
				{ 'x-idcommerce-api-token': process.env.TOKEN_ECOMMERCE }
			);

			if (responseGetAttributes.status == 200) {
				responseAttributes = await AxiosRequestType(
					process.env.URL_ECOMMERCE +
						`attributes/${message.attributeGroupId}/${message.id}`,
					message,
					'put',
					{ 'x-idcommerce-api-token': process.env.TOKEN_ECOMMERCE }
				);
			} else {
				responseAttributes = await AxiosRequestType(
					process.env.URL_ECOMMERCE + `attributes`,
					message,
					'post',
					{
						'x-idcommerce-api-token': process.env.TOKEN_ECOMMERCE
					}
				);
			}

			let myResponse: any;

			if (responseAttributes.status == 200) {
				myResponse = JSON.stringify(responseAttributes.message);
			} else {
				myResponse = responseAttributes.message;
				myResponse = JSON.stringify(myResponse.response.data);
			}

			loggerElastic(
				this.indexName,
				responseAttributes.status.toString(),
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
			throw new Errors.MoleculerError(error.message, error.code);
		}
	}
}
