export interface IOrderStatusChenge {
	id?: number;
	runDate: Date;
	runTime: string;
	range: Date;
	tenantId: string;
	branchId: string;
	sourceCRM: string;
	commandSent: string;
	success: boolean;
	responseCode: number;
	response: string;
}
