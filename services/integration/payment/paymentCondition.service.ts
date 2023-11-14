import {
	Context,
	Errors,
	Service as MoleculerService,
	ServiceBroker,
	ServiceSchema
} from 'moleculer';
import { Action, Event, Service } from 'moleculer-decorators';
import PaymentConditionController from '../../../src/controller/integration/payment/paymentCondition.controller';
import { connectionIntegrador } from '../../../src/data-source';
import { IConditionPayments } from '../../../src/interface/integration/payment/paymentCondition.interface';
import { apmElasticConnect, loggerElastic } from '../../library/elasticSearch';
import { IPaymentConditionsReturnErpData } from '../../../src/interface/erpProtheus/payment/paymentCondition.interface';

@Service({
	name: 'paymentCondition',
	group: 'flow-cremmer'
})
export default class PaymentCondition extends MoleculerService {
	public checkCondPay: any;
	public objParams: any;
	public errorMessage = 'Não existe subsidiary';
	public indexName = 'flow-integration-api';
	public serviceName = 'paymentCondition.service';
	public originLayer = 'integration';
	public statusElastic: '200';
	public noData = 'Não ha dados';
	public sucessSend = 'Consultation carried out';

	public constructor(public broker: ServiceBroker, schema: ServiceSchema) {
		super(broker);
	}

	async started() {
		try {
			await connectionIntegrador.initialize();
		} catch (error) {
			loggerElastic(
				this.indexName,
				'500',
				this.originLayer,
				this.serviceName,
				'',
				JSON.stringify(error.message)
			);
			this.logger.error(error.message, 500);
		}
	}

	@Action({
		cache: false,
		rest: 'GET condition/',
		params: {
			cod_empresa_crm: 'string',
			cod_sistema_crm: 'string',
			cod_cond_pagto_crm: 'string'
		},
		name: 'service.integration.paymentCondition',
		group: 'cremer'
	})
	public async GetPaymentsCondition(ctx: Context<IConditionPayments>) {
		try {
			this.objParams = ctx.params;

			const checkCondition = new PaymentConditionController(
				this.objParams
			);

			this.checkCondPay = await checkCondition.PaymentCheckAll(
				this.objParams
			);

			this.jsonReturn = {
				empresaCrm: this.checkCondPay.cod_empresa_crm,
				condicaoCrm: this.checkCondPay.cod_sistema_crm,
				filialCrm: this.checkCondPay.cod_cond_pagto_crm,
				empresaErp: this.checkCondPay.cod_empresa_erp,
				codigoErp: this.checkCondPay.cod_sistema_erp,
				condicaoErp: this.checkCondPay.cod_cond_pagto_erp
			};

			if (this.checkCondPay) {
				loggerElastic(
					this.indexName,
					this.statusElastic,
					this.originLayer,
					this.serviceName,
					JSON.stringify(this.objParams),
					JSON.stringify(this.jsonReturn)
				);

				return {
					code: 201,
					message: this.jsonReturn,
					status: 'Sucesso'
				};
			} else {
				loggerElastic(
					this.indexName,
					this.statusElastic,
					this.originLayer,
					this.serviceName,
					JSON.stringify(this.objParams),
					this.checkCondPay
				);
			}

			return {
				code: 401,
				message: this.errorMessage,
				status: 'Error'
			};
		} catch (error) {
			loggerElastic(
				this.indexName,
				'499',
				this.originLayer,
				this.serviceName,
				JSON.stringify(this.objParams),
				JSON.stringify(error.message)
			);
			apmElasticConnect.captureError(new Error(error.message));
			throw new Errors.MoleculerError(
				error.message,
				499,
				'TRY_CATCH_ERROR',
				this.objParams
			);
		}
	}

	@Event({
		name: 'service.integration.payment.paymentCondition.savePaymentCondition',
		group: 'flow-cremmer-integration-paymentCondition'
	})
	public async SavePaymentCondition(
		message: IPaymentConditionsReturnErpData
	) {
		try {
			for (const iterator of message.data) {
				const tableFields: IConditionPayments = {
					cod_empresa_crm: process.env.CODE_COMPANY_CRM,
					cod_sistema_crm: process.env.CODE_SYSTEM_CRM,
					cod_cond_pagto_crm: iterator.id_ISO,
					cod_empresa_erp: process.env.CODE_COMPANY_ERP,
					cod_sistema_erp: parseInt(process.env.CODE_SYSTEM_ERP),
					cod_cond_pagto_erp: iterator.id
				};

				const paymentController = new PaymentConditionController(
					tableFields
				);
				const existPaymentErp = await paymentController.GetPaymentByErp(
					tableFields
				);

				if (existPaymentErp) {
					await paymentController.PutPaymentCode(tableFields);
				} else {
					await paymentController.PostPaymentCode(tableFields);
				}

				await loggerElastic(
					this.indexName,
					'200',
					this.originLayer,
					this.serviceName,
					JSON.stringify(iterator),
					JSON.stringify(tableFields)
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
		}
	}

	async stoped() {
		return await connectionIntegrador.destroy();
	}
}
