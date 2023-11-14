export interface IUpdatesErpCheckedStatusChange {
	runDate: Date;
	runTime: string;
	range: Date;
	tenantId: string;
	branchId: string;
	sourceCRM: string;
	commandSent: string;
	success: string;
	responseCode: number;
	response: string;
}
