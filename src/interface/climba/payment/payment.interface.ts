export interface IPayment {
	id?: number;
	description?: string;
	transactionId?: string;
	brand?: string;
	paymentDate?: string;
	paymentType?: string;
	nsu?: string;
	authorizationCode?: string;
	paymentLink?: string;
	paymentDueDate?: string;
}
