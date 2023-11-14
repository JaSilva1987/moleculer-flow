import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	CreateDateColumn,
	UpdateDateColumn,
	BaseEntity
} from 'typeorm';

@Entity('integrador_alcis_order_confirmation')
export class OrderConfirmationEntity extends BaseEntity {
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
