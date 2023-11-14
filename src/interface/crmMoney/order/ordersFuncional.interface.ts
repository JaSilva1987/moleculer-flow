export interface IMoneyOrdersFuncional {
	orders: IIMoneyOrdersFuncional[];
}
export interface IIMoneyOrdersFuncional {
	customerName?: string;
	preAuthorizationCode?: string;
	notifyEndpoint: string;
	items: IIMoneyItemsFuncional[];
}

export interface IIMoneyItemsFuncional {
	productEAN: string;
	productCode: string;
	quantity: number;
}
