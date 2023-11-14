export default interface ISendCompany {
	app_key: string;
	app_secret: string;
	empresas_filiais: IFilialCompany[];
}

export interface IFilialCompany {
	empresaIdERP: string;
	filialIdERP: number;
	cnpj: string;
	razaosocial: string;
	nomefantasia: string;
	cep: string;
	endereco: string;
	numero: string;
	bairro: string;
	cidade: string;
	estado: string;
	complemento: string;
}
