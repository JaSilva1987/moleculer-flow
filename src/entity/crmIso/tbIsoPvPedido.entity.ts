import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { IIsoPvPedido } from '../../interface/crmIso/order/isoPvPedido.interface';

@Entity('ISOPVPEDIDO')
export class IsoPvPedidoEntity implements IIsoPvPedido {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	ISOPvPedSit_Codigo: number;

	@Column()
	ISOEmp_Codigo: number;

	@Column()
	ISOPvPed_Codigo: number;
}
