export interface IStockPfsIntegration {
	id?: number;
	codigoEan: string;
	armazen: string;
	JSON: string;
	status: string;
	createdAt?: Date;
	updatedAt?: Date;
}
