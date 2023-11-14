import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	CreateDateColumn,
	UpdateDateColumn
} from 'typeorm';
import { IIIReservationConfirmation } from '../../interface/alcis/reservationConfirmation/reservationConfirmation.interface';

@Entity('integrador_alcis_reservation')
export class ReservationConfirmationEntity
	implements IIIReservationConfirmation
{
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ type: 'nvarchar' })
	site: string;

	@Column({ type: 'nvarchar' })
	numeroPedido: string;

	@Column({ type: 'nvarchar' })
	json: string;

	@Column({ type: 'nvarchar' })
	status: string;

	@CreateDateColumn({ type: 'datetime', default: () => 'GETDATE()' })
	createdAt: Date;

	@UpdateDateColumn({ type: 'datetime', default: () => 'GETDATE()' })
	updatedAt: Date;
}
