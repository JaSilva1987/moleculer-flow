import { Errors } from 'moleculer';
import { connectionIntegrador } from '../../../data-source';
import { ConditionPaymentsEntity } from '../../../entity/integration/paymentCondition.entity';
import { IConditionPayments } from '../../../interface/integration/payment/paymentCondition.interface';

export const PaymentCheckRepository = connectionIntegrador
	.getRepository(ConditionPaymentsEntity)
	.extend({
		async GetPayCondition(
			cod_empresa_crm: string,
			cod_sistema_crm: number,
			cod_cond_pagto_crm: string
		): Promise<IConditionPayments> {
			try {
				const payCondition = await this.findOne({
					where: {
						cod_empresa_crm,
						cod_sistema_crm,
						cod_cond_pagto_crm
					}
				});

				return payCondition;
			} catch (error) {
				throw new Errors.MoleculerRetryableError(error.message, 100);
			}
		},

		async GetPayConditionErp(
			cod_empresa_erp: string,
			cod_sistema_erp: number,
			cod_cond_pagto_erp: string
		): Promise<IConditionPayments> {
			try {
				const payCondition = await this.findOne({
					where: {
						cod_empresa_erp,
						cod_sistema_erp,
						cod_cond_pagto_erp
					}
				});

				return payCondition;
			} catch (error) {
				throw new Errors.MoleculerRetryableError(error.message, 100);
			}
		},

		async PostPayCondition(postMessage: IConditionPayments) {
			try {
				const postOrder = await this.createQueryBuilder()
					.insert()
					.into(ConditionPaymentsEntity)
					.values(postMessage)
					.execute();

				return postOrder;
			} catch (error) {
				throw new Errors.MoleculerRetryableError(error.message, 100);
			}
		},

		async PutPayCondition(
			message: IConditionPayments
		): Promise<IConditionPayments> {
			try {
				const putOrders = this.createQueryBuilder()
					.update(ConditionPaymentsEntity)
					.set({
						cod_empresa_erp: message.cod_empresa_erp,
						cod_sistema_erp: message.cod_sistema_erp,
						cod_cond_pagto_erp: message.cod_cond_pagto_erp
					})
					.where('cod_empresa_crm = :cod_empresa_crm', {
						cod_empresa_crm: message.cod_empresa_crm
					})
					.andWhere('cod_sistema_crm = :cod_sistema_crm', {
						cod_sistema_crm: message.cod_sistema_crm
					})
					.andWhere('cod_cond_pagto_crm = :cod_cond_pagto_crm', {
						cod_cond_pagto_crm: message.cod_cond_pagto_crm
					})
					.execute();

				return putOrders;
			} catch (error) {
				throw new Errors.MoleculerRetryableError(error.message, 100);
			}
		},

		async PutPayConditionByErp(
			message: IConditionPayments
		): Promise<IConditionPayments> {
			try {
				const putOrders = this.createQueryBuilder()
					.update(ConditionPaymentsEntity)
					.set({
						cod_empresa_crm: message.cod_empresa_crm,
						cod_sistema_crm: message.cod_sistema_crm,
						cod_cond_pagto_crm: message.cod_cond_pagto_crm
					})
					.where('cod_empresa_erp = :cod_empresa_erp', {
						cod_empresa_erp: message.cod_empresa_erp
					})
					.andWhere('cod_sistema_erp = :cod_sistema_erp', {
						cod_sistema_erp: message.cod_sistema_erp
					})
					.andWhere('cod_cond_pagto_erp = :cod_cond_pagto_erp', {
						cod_cond_pagto_erp: message.cod_cond_pagto_erp
					})
					.execute();

				return putOrders;
			} catch (error) {
				throw new Errors.MoleculerRetryableError(error.message, 100);
			}
		}
	});
