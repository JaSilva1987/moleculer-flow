export interface IProductsFuncional {
	groupId: string;
	productEAN: string;
	pageNumber: string;
	pageSize: string;
	internalCode: string;
}

export interface INewProductsFuncional {
	protheus: string;
	urlObj: object;
}

export interface IResponsePFuncional {
	viveo: IIResponsePFuncional;
}

export interface IIResponsePFuncional {
	total: number;
	mafra: Array<Object>;
}

export interface IReturnFuncionalPProtheus {
	total: number;
	hasNext: boolean;
	products: Array<Object>;
}

export interface TreatmentPProtheus {
	responseTotvs: object;
	isValid: boolean;
}

export interface TreatmentControllerProduct {
	status: number;
	message: object;
}
