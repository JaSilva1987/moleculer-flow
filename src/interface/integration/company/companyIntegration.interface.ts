export interface ICompanyIntegration {
	id?: number;
	conector: string;
	empresaIdERP: string;
	filialIdERP: string;
	cnpj: string;
	tipoErp: string;
	nomeCliente: string;
	ativo: string;
	insertedAt: Date;
	updatedAt: Date;
}
