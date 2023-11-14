import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';
import ISystemFlow from '../../interface/integration/system/systemFlow.interface';

@Entity('flow_sistemas')
export class SystemFlowEntity implements ISystemFlow {
	@PrimaryColumn()
	cod_empresa: string;

	@PrimaryColumn()
	cod_sistema: number;

	@Column()
	nome_sistema: string;

	@Column()
	tipo_sistema: string;
}
