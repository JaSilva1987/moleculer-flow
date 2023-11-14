export interface ISaveOrders {
	tenantId: string;
	orderId: string;
	sourceCRM: string;
	createdAt?: Date;
	updatedAt?: Date;
	json_order?: string;
	branchId?: string;
	orderIdERP?: string;
	status?: string;
	log?: string;
}

export interface IEnvOrders {
	orders: [IIEnvOrders];
}

export interface IIEnvOrders {
	companyID: string;
	branchID: string;
	preAuthorizationCode: string;
	internalOrder: string;
	customerID: string;
	branchCustomer: string;
	salesERPOrder: string;
	documentID: string;
	serieID: string;
	accessKeyNFE: string;
	emissionDate: string;
	authorizationDateNFE: string;
	deliveredDate: string;
	processLog: string;
	statusOrder: string;
	typeDocument: string;
}
