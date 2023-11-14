export interface IEcommerceProductIntegration {
	id?: number;
	productId: string;
	productSku: string;
	nameProduct: string;
	JSON: string;
	status: string;
	createdAt?: Date;
	updatedAt?: Date;
	IPI?: number;
	originProduct?: string;
}
