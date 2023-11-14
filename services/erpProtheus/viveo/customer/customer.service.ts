'use strict';

import * as dotenv from 'dotenv';
import {
	Errors,
	Service as MoleculerService,
	ServiceBroker,
	ServiceSchema
} from 'moleculer';
import { Event, Service } from 'moleculer-decorators';
import { ICustomerDataSimple } from '../../../../src/interface/erpProtheus/customer/customer.interface';
import { IGetToken } from '../../../../src/interface/erpProtheus/global';
import { AxiosRequestType } from '../../../library/axios';
import {
	apmElasticConnect,
	loggerElastic
} from '../../../library/elasticSearch';
import { getTokenUrlGlobal } from '../../../library/erpProtheus';

dotenv.config();
@Service({
	name: 'ecommerce.erpprotheusviveo.customer',
	group: 'flow-climba'
})
export default class CustomerProtheus extends MoleculerService {
	public constructor(public broker: ServiceBroker, schema: ServiceSchema) {
		super(broker);
	}

	public indexName = 'flow-ecommerce-customer';
	public serviceName = 'erpProtheusViveo.customer.service';
	public originLayer = 'erpprotheusviveo';

	@Event({
		name: 'service.erpProtheusViveo.customer.getcustomer',
		group: 'flow-climba'
	})
	public async GetCustomer(docNumber: string) {
		try {
			this.logger.info(
				'==============BUSCA CUSTOMER PROTHEUS=============='
			);

			const token: IGetToken = await getTokenUrlGlobal(
				process.env.PROTHEUSVIVEO_BASEURL_BELLACOTTON +
					'11' +
					process.env.PROTHEUSVIVEO_URLTOKEN +
					process.env.PROTHEUSVIVEO_USER +
					process.env.PROTHEUSVIVEO_PASS
			);

			if (token.access_token) {
				const urlProtheusCustomer =
					process.env.PROTHEUSVIVEO_BASEURL_BELLACOTTON +
					process.env.PROTHEUSVIVEO_RESTCREMER +
					'/FlowIntegration/api/v2/customer';

				const requestProtheus = await AxiosRequestType(
					urlProtheusCustomer,
					'',
					'get',
					{
						['Authorization']: 'Bearer ' + token.access_token,
						TenantId: '11,001043'
					},
					{ Filter: `codeEcommerce eq '${docNumber}'` }
				);

				return requestProtheus;
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

	@Event({
		name: 'service.erpProtheusViveo.customer.putcustomer',
		group: 'flow-climba'
	})
	public async PutCustomer(message: ICustomerDataSimple) {
		try {
			this.logger.info(
				'==============PUT CUSTOMER PROTHEUS=============='
			);

			const token: IGetToken = await getTokenUrlGlobal(
				process.env.PROTHEUSVIVEO_BASEURL_BELLACOTTON +
					'11' +
					process.env.PROTHEUSVIVEO_URLTOKEN +
					process.env.PROTHEUSVIVEO_USER +
					process.env.PROTHEUSVIVEO_PASS
			);

			if (token.access_token) {
				const urlProtheusCustomer =
					process.env.PROTHEUSVIVEO_BASEURL_BELLACOTTON +
					process.env.PROTHEUSVIVEO_RESTCREMER +
					'/FlowIntegration/api/v2/customer';

				const requestProtheus = await AxiosRequestType(
					urlProtheusCustomer,
					message,
					'put',
					{ ['Authorization']: 'Bearer ' + token.access_token }
				);

				return requestProtheus;
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

	@Event({
		name: 'service.erpProtheusViveo.customer.postcustomer',
		group: 'flow-climba'
	})
	public async PostCustomer(message: ICustomerDataSimple) {
		try {
			this.logger.info(
				'==============POST CUSTOMER PROTHEUS=============='
			);

			const token: IGetToken = await getTokenUrlGlobal(
				process.env.PROTHEUSVIVEO_BASEURL_BELLACOTTON +
					'11' +
					process.env.PROTHEUSVIVEO_URLTOKEN +
					process.env.PROTHEUSVIVEO_USER +
					process.env.PROTHEUSVIVEO_PASS
			);

			if (token.access_token) {
				const urlProtheusCustomer =
					process.env.PROTHEUSVIVEO_BASEURL_BELLACOTTON +
					process.env.PROTHEUSVIVEO_RESTCREMER +
					'/FlowIntegration/api/v2/customer';

				const requestProtheus = await AxiosRequestType(
					urlProtheusCustomer,
					message,
					'post',
					{ ['Authorization']: 'Bearer ' + token.access_token }
				);

				return requestProtheus;
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
