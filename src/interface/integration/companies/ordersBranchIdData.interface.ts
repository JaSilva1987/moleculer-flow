export interface IOrdersBranchIds {
	tenantId: string;
	branchId: string;
	sourceCRM: string;
	data: Date;
	hora: Date;
}

export interface IArrayOrdersBranchIds {
	orders: IOrdersBranchIds;
}
