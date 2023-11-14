export interface ICustomersFuncional {
	groupId: string;
	pageNumber: string;
	pageSize: string;
	customerID: string;
	federalID: string;
	stateName: string;
}

export interface INewCustomersFuncional {
	protheus: string;
	urlObj: object;
}

export interface IResponseFuncional {
	viveo: IIResponseFuncional;
}

export interface IIResponseFuncional {
	total: number;
	mafra: Array<Object>;
}

export interface IReturnFuncionalProtheus {
	total: number;
	hasNext: boolean;
	customers: Array<Object>;
}

export interface TreatmentProtheus {
	responseTotvs: object;
	isValid: boolean;
}

export interface TreatmentControllerCustomer {
	status: number;
	message: object;
}
