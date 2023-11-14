import { Column, Entity, PrimaryColumn } from 'typeorm';
import { IConditionPayments } from '../../interface/integration/payment/paymentCondition.interface';

@Entity('flow_de_para_cond_pagto')
export class ConditionPaymentsEntity implements IConditionPayments {
	@PrimaryColumn()
	cod_empresa_crm: string;

	@PrimaryColumn()
	cod_sistema_crm: number;

	@PrimaryColumn()
	cod_cond_pagto_crm: string;

	@PrimaryColumn()
	cod_empresa_erp: string;

	@PrimaryColumn()
	cod_sistema_erp: number;

	@Column()
	cod_cond_pagto_erp: string;
}
