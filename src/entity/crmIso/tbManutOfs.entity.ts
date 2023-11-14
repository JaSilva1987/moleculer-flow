import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { IUpdateManutOf } from '../../interface/crmIso/orderFat/updateManutOf.interface';

@Entity('ManutOFs')
export class ManutOfsEntity implements IUpdateManutOf {
	@Column()
	ManOF_Processado: string;

	@Column()
	ManOF_DHProc: Date;

	@PrimaryGeneratedColumn()
	ManOF_Filial: string;

	@PrimaryGeneratedColumn()
	ManOF_OFNro: string;

	@PrimaryGeneratedColumn()
	ManOF_Seq: number;

	@Column()
	ManOF_NroPedidoCRM: string;
}
