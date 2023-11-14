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
import { ISendInvoiceOrder } from '../../../src/interface/climba/invoice/invoice.interface';
import { EcommerceInvoiceIntegrationRepository } from '../../../src/repository/integration/invoice/invoice.repository';
import { statusEcommerceIntegration } from '../../../src/enum/integration/statusEcommerceProducts.enum';

dotenv.config();
@Service({
	name: 'invoice-climba',
	group: 'climba-ecommerce'
})
export default class PostInvoiceOrderClimba extends MoleculerService {
	public constructor(public broker: ServiceBroker, schema: ServiceSchema) {
		super(broker);
	}

	public indexName = 'flow-ecommerce-invoice';
	public serviceName = 'climba.invoice.service';
	public originLayer = 'climbaEcommerce';

	@Event({
		name: 'service.climba.invoice.PostInvoice',
		group: 'flow-climba'
	})
	public async PostInvoiceOrder(message: ISendInvoiceOrder) {
		this.logger.info(
			'==============ENVIO DE NOTA FISCAL- ECOMMERCE=============='
		);
		try {
			apmElasticConnect.startTransaction(
				'IE V1 => Climba - POST Invoice',
				'request'
			);
			const responseGetInvoice = await AxiosRequestType(
				process.env.URL_ECOMMERCE +
					`orders/${message.dataInvoice.idOrder}/invoice`,
				message.jsonInvoice,
				'post',
				{ 'x-idcommerce-api-token': process.env.TOKEN_ECOMMERCE }
			);
			apmElasticConnect.endTransaction(responseGetInvoice);

			const repository = EcommerceInvoiceIntegrationRepository;

			const existInvoiceOrder =
				await repository.GetEcommerceInvoiceIntegration(
					message.dataInvoice.idOrder,
					message.dataInvoice.numberInvoice
				);

			if (responseGetInvoice.status == 200) {
				const responseGetBilled = await AxiosRequestType(
					process.env.URL_ECOMMERCE +
						`orders/${message.dataInvoice.idOrder}/billed`,
					message.jsonInvoice,
					'put',
					{ 'x-idcommerce-api-token': process.env.TOKEN_ECOMMERCE }
				);

				if (responseGetBilled.status == 200) {
					if (existInvoiceOrder.length > 0) {
						message.dataInvoice.status =
							statusEcommerceIntegration.success;
					}
				}
			} else {
				message.dataInvoice.status = `${
					statusEcommerceIntegration.erro
				} - ${JSON.stringify(responseGetInvoice.message)}`;
			}

			await repository.PutEcommerceInvoiceIntegration(
				message.dataInvoice,
				existInvoiceOrder[0].id
			);

			loggerElastic(
				this.indexName,
				responseGetInvoice.status.toString(),
				this.originLayer,
				this.serviceName,
				`${process.env.URL_ECOMMERCE} - Body: ${JSON.stringify(
					message
				)}`,
				JSON.stringify(responseGetInvoice.message)
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
