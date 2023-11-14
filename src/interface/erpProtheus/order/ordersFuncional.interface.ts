export interface IReturnProtheus {
	code: string;
	message: string;
	detailedMessage: string;
	helpUrl: string;
	details: IDetails[];
}

export interface IDetails {
	companyID: string;
	branchID: string;
	preAuthorizationCode: string;
	numberDeliveryOrder: string;
}
