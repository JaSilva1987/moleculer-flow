export interface IStatus {
	companyID: string;
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

export interface INewStatus {
	cronJob: boolean;
	methodSend: string;
	urlObj: object;
}
