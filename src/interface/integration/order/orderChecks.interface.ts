export interface IOrderCheck {
	tenantId: string;
	orderId: string;
	sourceCRM: string;
	checkDescription: string;
	seq: number;
	topicName: string;
	createdAt: Date;
	updatedAt: Date;
	sent: string;
	success: string;
	retryNumber: number;
	nextTry: Date;
	commandSent: string;
	url: string;
	method: string;
	body: string;
	responseCode: number;
	response: string;
	validations_ok: number;
	branchId?: string;
}
