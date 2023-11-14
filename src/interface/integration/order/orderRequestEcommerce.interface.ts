export interface IOrderRequestEcommerceIntegration {
	id?: number;
	idOrder: string;
	statusOrder: string;
	JSON: string;
	JSONRetorno?: string;
	status: string;
	createdAt?: Date;
	updatedAt?: Date;
}
