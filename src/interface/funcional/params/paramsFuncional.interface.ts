export interface IParamsFunctional {
	authorization?: boolean;
	orders: [
		{
			companyID: string;
			branchID: string;
			customerID: string;
			branchCustomer: string;
			sequenceAddress: string;
			customerName: string;
			preAuthorizationCode: string;
			notifyEndpoint: string;
			items: [
				{
					productEAN: string;
					productCode: string;
					quantity: number;
				}
			];
		}
	];
}

export interface IOrdersProtheus {
	codeCompany: string;
	codeSubsidiary: string;
	jsonEnv: string;
}
