import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { IUpdateIsoPvPedItem } from '../../interface/crmIso/orderFat/updateIsoPvPedItem.interface';

@Entity('ISOPVPEDITEM')
export class IsoPvPedItemEntity implements IUpdateIsoPvPedItem {
	@Column()
	ISOPvPedIteSit_Codigo: number;

	@Column()
	ISOPvPedIteMoc_Codigo: number;

	@PrimaryGeneratedColumn()
	ISOEmp_Codigo: string;

	@PrimaryGeneratedColumn()
	ISOPvPed_Codigo: string;

	@PrimaryGeneratedColumn()
	ISOPvPedIte_Codigo: string;

	@Column()
	ISOPvPedIte_Quantidade: number;

	@Column()
	ISOPvPedIte_DtaSolEntrega: Date;
}
