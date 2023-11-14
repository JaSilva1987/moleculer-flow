export interface IStocksFuncional {
	groupId: string;
	codeEAN?: string;
	pageNumber: string;
	pageSize: string;
	productEAN?: string;
	internalCode?: string;
}

export interface INewStocksFuncional {
	protheus: string;
	codeEAN: string;
	numberPage: string;
	numbeSize: string;
	urlObj: object;
}

export interface IResponseSFuncional {
	viveo: IIResponseSFuncional;
}

export interface IIResponseSFuncional {
	total: number;
	mafra: Array<Object>;
}

export interface IReturnFuncionalSProtheus {
	total: number;
	hasNext: boolean;
	stocks: Array<Object>;
	success?: boolean;
}

export interface TreatmentSProtheus {
	responseTotvs: object;
	isValid: boolean;
}

export interface TreatmentControllerStock {
	status: number;
	message: object;
}
