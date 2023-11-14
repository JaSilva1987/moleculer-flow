'use strict';

import { CronJob } from 'cron';
import * as dotenv from 'dotenv';
import {
	Service as MoleculerService,
	ServiceBroker,
	ServiceSchema
} from 'moleculer';
import { Event, Service } from 'moleculer-decorators';
import { IGetToken } from '../../../../src/interface/erpProtheus/global';
import {
	IPaymentCondition,
	IPaymentConditionFlow,
	IVPaymentConditionFlow
} from '../../../../src/interface/erpProtheus/payment/paymentCondition.interface';
import { AxiosRequest, AxiosRequestType } from '../../../library/axios';
import {
	apmElasticConnect,
	loggerElastic
} from '../../../library/elasticSearch';
import { getTokenUrlGlobal } from '../../../library/erpProtheus';
import erpProtheusPaymentConditionController from '../../../../src/controller/erpProtheus/viveo/payment/paymentCondition.controller';
import { IConditionPayments } from '../../../../src/interface/integration/payment/paymentCondition.interface';

dotenv.config();
@Service({
	name: 'ecommerce.erpprotheusviveo.paymentCondition',
	group: 'flow-climba'
})
export default class PaymentConditionProtheus extends MoleculerService {
	public constructor(public broker: ServiceBroker, schema: ServiceSchema) {
		super(broker);
	}

	public indexName = 'flow-ecommerce-orderrequest';
	public serviceName = 'erpProtheus.payment.service';
	public originLayer = 'erpprotheusviveo';

	@Event({
		name: 'service.erpProtheusViveo.payment.getPaymentCondition',
		group: 'flow-erpProtheus'
	})
	public async getPaymentCondition(message: IPaymentCondition) {
		try {
			this.logger.info(
				'==============BUSCA PAYMENT CONDITION PROTHEUS=============='
			);

			const token: IGetToken = await getTokenUrlGlobal(
				process.env.PROTHEUSVIVEO_BASEURL_BELLACOTTON +
					'11' +
					process.env.PROTHEUSVIVEO_URLTOKEN +
					process.env.PROTHEUSVIVEO_USER +
					process.env.PROTHEUSVIVEO_PASS
			);

			if (token.access_token) {
				const urlProtheusPaymentCondition =
					process.env.PROTHEUSVIVEO_BASEURL_BELLACOTTON +
					process.env.PROTHEUSVIVEO_RESTCREMER +
					'/BellaCottonIntegration/api/v2/payment-condition';

				const requestProtheus = await AxiosRequestType(
					urlProtheusPaymentCondition,
					'',
					'get',
					{
						['Authorization']: 'Bearer ' + token.access_token,
						TenantId: '11,001043'
					},
					{
						Filter: `ecommerceInstallment eq ${message.ecommerceInstallment} and form eq '${message.form}'`
					}
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
		name: 'erpProtheusViveo.payment.getPaymentFlow',
		group: 'flow-erpProtheus'
	})
	public async GetPaymentFlow(message: IPaymentConditionFlow) {
		this.indexName = 'flow-integration-getpaymentconditionflow';
		this.serviceName = 'erpProtheus.getpaymentCondition.service';
		this.originLayer = 'erpprotheusviveo';
		try {
			const controller = new erpProtheusPaymentConditionController(
				this.broker,
				this.schema
			);

			this.logger.info(
				'==============BUSCA PAYMENT CONDITION PROTHEUS=============='
			);

			const token: IGetToken = await getTokenUrlGlobal(
				process.env.PROTHEUSVIVEO_BASEURL +
					process.env.PROTHEUSVIVEO_RESTCREMER +
					process.env.PROTHEUSVIVEO_URLTOKEN +
					process.env.PROTHEUSVIVEO_USER +
					process.env.PROTHEUSVIVEO_PASS
			);

			if (token.access_token) {
				this.logger.info(
					'==============INÍCIO BUSCA PAYMENT CONDITION PROTHEUS=============='
				);
				const urlProtheusPaymentCondition =
					process.env.PROTHEUSVIVEO_BASEURL +
					process.env.PROTHEUSVIVEO_RESTCREMER +
					'/BellaCottonIntegration/api/v2/payment-condition';

				let filterProtheus: string = '';

				if (message.filter) {
					filterProtheus = `id_ISO eq '${message.filter}'`;

					const requestProtheus = await AxiosRequestType(
						urlProtheusPaymentCondition,
						'',
						'get',
						{
							['Authorization']: 'Bearer ' + token.access_token
						},
						{
							Filter: filterProtheus,
							Page: 1
						}
					);

					if (
						requestProtheus.status == 200 ||
						requestProtheus.status == 201
					) {
						let jsonData: IVPaymentConditionFlow =
							requestProtheus.message;

						await loggerElastic(
							this.indexName,
							String(requestProtheus.status),
							this.originLayer,
							this.serviceName,
							JSON.stringify(message),
							JSON.stringify(jsonData)
						);

						const paymentCondition: IConditionPayments = {
							cod_empresa_crm: process.env.CODE_COMPANY_CRM,
							cod_sistema_crm: process.env.CODE_SYSTEM_CRM,
							cod_cond_pagto_crm: jsonData.data.id_ISO,
							cod_empresa_erp: process.env.CODE_COMPANY_ERP,
							cod_sistema_erp: parseInt(
								process.env.CODE_SYSTEM_ERP
							),
							cod_cond_pagto_erp: jsonData.data.id
						};

						this.logger.info(
							'==============CÓDIGO PAYMENT CONDITION PROTHEUS==============' +
								paymentCondition
						);

						if (paymentCondition) {
							controller.validateSavePayment(paymentCondition);
						}
						return paymentCondition;
					} else {
						return null;
					}
				} else {
					return null;
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

			return null;
		}
	}
}
