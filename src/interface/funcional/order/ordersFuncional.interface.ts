export interface IOrdersFuncional {
	orders: IIOrderFuncional[];
}

export interface IIOrderFuncional {
	customerName: string;
	preAuthorizationCode?: string;
	notifyEndpoint: string;
	items: ItemOrdersFuncional[];
}

export interface ItemOrdersFuncional {
	productEAN: string;
	productCode: string;
	quantity: number;
}

export interface IOrdersProtheus {
	codeCompany: string;
	codeSubsidiary: string;
	jsonEnv: string;
	methodSend: any;
}

export interface IOrdersMoneyFuncional {
	authorization: boolean;
	orders: IIOrdersMoneyFuncional[];
}

export interface IIOrdersMoneyFuncional {
	companyID: string;
	branchID: string;
	customerID: string;
	branchCustomer: string;
	sequenceAddress: string;
	customerName: string;
	preAuthorizationCode?: string;
	notifyEndpoint: string;
	items: ItemOrdersMoneyFuncional[];
}

export interface ItemOrdersMoneyFuncional {
	productEAN: string;
	productCode: string;
	quantity: number;
}

export interface IGetOrdersFuncional {
	groupId: string;
	pageNumber?: string;
	pageSize?: string;
	cronJob?: boolean;
	methodSend: string;
	preAuthorizationCode?: string;
	internalOrder?: string;
	salesERPOrder?: string;
	isRange?: string;
	salesInternal?: string;
	dateTimeUpdate?: string;
}

export interface TreatmentOrdersProtheus {
	responseTotvs: object;
	isValid: boolean;
}

export interface TreatmentControllerOrders {
	status: number;
	message: object;
}

export interface IReturnFuncionalOGProtheus {
	total: number;
	hasNext: boolean;
	orders: Array<Object>;
}
