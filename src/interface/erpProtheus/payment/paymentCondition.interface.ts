export interface IPaymentCondition {
	id?: string;
	id_ISO?: string;
	description?: string;
	payment_condition?: string;
	type?: string;
	ipi_type?: string;
	icms_type?: string;
	condition_date?: string;
	form?: string;
	financial_increase?: string;
	porcent_acrescimo?: number;
	financial_discount?: number;
	status?: string;
	ecommerceInstallment?: number;
}

export interface IPaymentConditionFlow {
	filter?: string;
	enabled?: string;
}

export interface IPaymentConditionsReturnErpData {
	total: number;
	hasNext: boolean;
	data: [IPaymentConditionsReturnErpDataItems];
}

export interface IPaymentConditionsReturnErpDataItems {
	id: string;
	id_ISO: string;
	description: string;
	payment_condition: string;
	type: string;
	ipi_type: string;
	icms_type: string;
	condition_date: string;
	form: string;
	financial_increase: string;
	porcent_acrescimo: number;
	financial_discount: number;
	status: string;
	ecommerceInstallment: number;
}

export interface IVPaymentConditionFlow {
	total: number;
	hasNext: boolean;
	data: VIPaymentConditionFlow;
}

export interface VIPaymentConditionFlow {
	id: string;
	id_ISO: string;
	description: string;
	payment_condition: string;
	type: string;
	ipi_type: string;
	icms_type: string;
	condition_date: string;
	form: string;
	financial_increase: string;
	porcent_acrescimo: number;
	financial_discount: number;
	status: string;
	ecommerceInstallment: number;
}
