export interface ILogFlowIntegration {
	id?: number;
	tenantId: string;
	orderId: string;
	sourceCRM: string;
	name: string | null;
	status: string | null;
	description: string | null;
	dateTime: Date | null;
}
