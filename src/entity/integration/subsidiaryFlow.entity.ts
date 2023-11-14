import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';
import ISubsidiaryFlow from '../../interface/integration/company/subsidiaryFlow.interface';

@Entity('flow_filiais')
export class SubsidiaryFlowEntity implements ISubsidiaryFlow {
	@PrimaryColumn()
	cod_empresa: string;

	@PrimaryColumn()
	cod_filial: string;

	@Column({ type: 'bit' })
	nome_filial: string;

	@Column({ type: 'bit' })
	integrador: boolean;
}
