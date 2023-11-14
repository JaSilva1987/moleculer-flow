import { Errors } from 'moleculer';
import { loggerElastic } from '../../../../services/library/elasticSearch';
import { IConditionPayments } from '../../../interface/integration/payment/paymentCondition.interface';
import { PaymentCheckRepository } from '../../../repository/integration/payment/paymentCondition.repository';

export default class PaymentConditionController implements IConditionPayments {
	public indexName = 'flow-integration-routeorders';
	public serviceName = 'poolOrders.controller';
	public originLayer = 'integration';
	public returnEmpty = 'There is no data';
	public noData = 'Não ha dados';
	public payCondition: any;
	public cod_empresa_crm: string;
	public cod_sistema_crm: number | string;
	public cod_cond_pagto_crm: string;
	public cod_empresa_erp: string;
	public cod_sistema_erp: number;
	public cod_cond_pagto_erp: string;

	public constructor(message: IConditionPayments) {
		try {
			this.cod_empresa_crm = message.cod_empresa_crm;
			this.cod_sistema_crm = message.cod_sistema_crm;
			this.cod_cond_pagto_crm = message.cod_cond_pagto_crm;
			if (
				this.cod_empresa_crm == undefined ||
				this.cod_sistema_crm == undefined ||
				this.cod_cond_pagto_crm == undefined
			)
				throw process.env.MESSAGE_PAYMENTCONDITION_THROW;
		} catch (err) {
			throw new Errors.MoleculerError(err.message, err.code);
		}
	}

	public async PaymentCheckAll(
		message: IConditionPayments
	): Promise<PaymentConditionController> {
		try {
			this.payCondition = PaymentCheckRepository.GetPayCondition(
				message.cod_empresa_crm,
				Number(message.cod_sistema_crm),
				message.cod_cond_pagto_crm
			);

			return this.payCondition;
		} catch (error) {
			loggerElastic(
				this.indexName,
				'499',
				this.originLayer,
				this.serviceName,
				JSON.stringify(message),
				JSON.stringify(error.message)
			);
			throw new Errors.MoleculerError(error.message, error.code);
		}
	}

	public async GetPaymentByErp(
		message: IConditionPayments
	): Promise<PaymentConditionController> {
		try {
			this.payCondition = PaymentCheckRepository.GetPayConditionErp(
				message.cod_empresa_erp,
				Number(message.cod_sistema_erp),
				message.cod_cond_pagto_erp
			);

			return this.payCondition;
		} catch (error) {
			loggerElastic(
				this.indexName,
				'499',
				this.originLayer,
				this.serviceName,
				JSON.stringify(message),
				JSON.stringify(error.message)
			);
			throw new Errors.MoleculerError(error.message, error.code);
		}
	}

	async PostPaymentCode(ctxMessage: IConditionPayments) {
		try {
			const savePaymentCode =
				await PaymentCheckRepository.PostPayCondition({
					cod_empresa_crm: ctxMessage.cod_empresa_crm,
					cod_sistema_crm: ctxMessage.cod_sistema_crm,
					cod_cond_pagto_crm: ctxMessage.cod_cond_pagto_crm,
					cod_empresa_erp: ctxMessage.cod_empresa_erp,
					cod_sistema_erp: ctxMessage.cod_sistema_erp,
					cod_cond_pagto_erp: ctxMessage.cod_cond_pagto_erp
				});

			return savePaymentCode;
		} catch (error) {
			loggerElastic(
				this.indexName,
				'499',
				this.originLayer,
				this.serviceName,
				JSON.stringify(ctxMessage),
				JSON.stringify(error.message)
			);
			throw new Errors.MoleculerRetryableError(error.message, 100);
		}
	}

	async PutPaymentCode(ctxMessage: IConditionPayments) {
		try {
			const putPaymentCode =
				await PaymentCheckRepository.PutPayConditionByErp(ctxMessage);

			return putPaymentCode;
		} catch (error) {
			loggerElastic(
				this.indexName,
				'499',
				this.originLayer,
				this.serviceName,
				JSON.stringify(ctxMessage),
				JSON.stringify(error.message)
			);
			throw new Errors.MoleculerRetryableError(error.message, 100);
		}
	}
}
