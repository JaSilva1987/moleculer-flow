import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { ICompanyIntegration } from '../../interface/integration/company/companyIntegration.interface';

@Entity('integracao_pelican_companies_config')
export class CompanyIntegrationEntity implements ICompanyIntegration {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	conector: string;

	@Column()
	empresaIdERP: string;

	@Column()
	filialIdERP: string;

	@Column()
	cnpj: string;

	@Column()
	tipoErp: string;

	@Column()
	nomeCliente: string;

	@Column()
	ativo: string;

	@Column()
	insertedAt: Date;

	@Column()
	updatedAt: Date;
}
