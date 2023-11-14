import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import ISubsidiaryCheck from '../../interface/integration/company/subsidiaryCheck.interface';

@Entity('flow_de_para_filiais')
export class SubsidiaryCheckEntity implements ISubsidiaryCheck {
	@PrimaryGeneratedColumn()
	cod_empresa_crm: string;

	@Column()
	cod_sistema_crm: number;

	@Column()
	cod_filial_crm: string;

	@Column()
	cod_empresa_erp: string;

	@Column()
	cod_sistema_erp: number;

	@Column()
	cod_filial_erp: string;
}
