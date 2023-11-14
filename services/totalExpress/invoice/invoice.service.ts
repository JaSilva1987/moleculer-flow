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
import { statusEcommerceIntegration } from '../../../src/enum/integration/statusEcommerceProducts.enum';
import { ISendInvoiceTotalExpress } from '../../../src/interface/integration/invoice/invoiceTotalExpress.interface';
import { InvoiceTotalExpressRepository } from '../../../src/repository/integration/invoice/invoiceTotalExpress.repository';

dotenv.config();
@Service({
	name: 'service.totalexpress.invoice',
	group: 'flow-totalexpress'
})
export default class PostInvoiceOrderClimba extends MoleculerService {
	public constructor(public broker: ServiceBroker, schema: ServiceSchema) {
		super(broker);
	}

	public indexName = 'flow-totalexpress-invoice';
	public serviceName = 'totalexpress.invoice.service';
	public originLayer = 'totalexpress';

	@Event({
		name: 'service.totalexpress.invoice.PostInvoice',
		group: 'flow-climba'
	})
	public async PostInvoice(message: ISendInvoiceTotalExpress) {
		try {
			const bodyRequest: Object = {
				grant_type: 'password',
				username: process.env.TOTAL_EXPRESS_USER_AUTH,
				password: process.env.TOTAL_EXPRESS_PASS_AUTH
			};

			apmElasticConnect.startTransaction(
				'ITE V1 => TotalExpress - POST Token',
				'request'
			);
			const responseToken = await AxiosRequestType(
				process.env.TOTAL_EXPRESS_BASE_URL +
					`/ics-seguranca/v1/oauth2/tokenGerar`,
				bodyRequest,
				'post',
				{
					Authorization: `Basic ${process.env.TOTAL_EXPRESS_AUTH_TOKEN}`
				}
			);
			apmElasticConnect.endTransaction(responseToken);

			const repository = await InvoiceTotalExpressRepository;

			if (responseToken.status === 200) {
				apmElasticConnect.startTransaction(
					'ITE V1 => TotalExpress - POST Registro Coleta',
					'request'
				);
				const responseColeta = await AxiosRequestType(
					process.env.TOTAL_EXPRESS_BASE_URL +
						`/ics-edi/v1/coleta/smartLabel/registrar`,
					message.jsonInvoice,
					'post',
					{
						Authorization: `Bearer ${responseToken.message.access_token}`
					}
				);
				apmElasticConnect.endTransaction(responseColeta);

				let status: string;
				if (responseColeta.status === 200) {
					status = '200';
					message.dataInvoice.status =
						statusEcommerceIntegration.success;
				} else {
					status = '400';
					message.dataInvoice.status = `${statusEcommerceIntegration.erro} - ${responseColeta.message}`;
				}

				const repository = InvoiceTotalExpressRepository;

				await repository.PutInvoiceTotalExpressIntegration(
					message.dataInvoice,
					message.dataInvoice.id
				);

				loggerElastic(
					this.indexName,
					status,
					this.originLayer,
					this.serviceName,
					JSON.stringify(message.jsonInvoice),
					JSON.stringify(responseColeta.message)
				);
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
