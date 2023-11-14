interface IGetTokenTable {
	id: number;
	token: string;
	tokenSystem: string;
	statusToken: 200 | 400;
	createdAt: Date;
	updatedAt?: Date;
	lifeTime?: string;
}

export { IGetTokenTable };
