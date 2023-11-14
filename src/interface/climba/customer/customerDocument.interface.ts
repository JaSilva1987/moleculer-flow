export interface ICustomerDocument {
	type?: 'cpf' | 'cnpj' | 'rg' | 'ie';
	number?: string;
}
