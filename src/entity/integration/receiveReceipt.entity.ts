import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	CreateDateColumn,
	UpdateDateColumn,
	BaseEntity
} from 'typeorm';

@Entity('integrador_alcis_receive_receipt')
export class ReceiveReceiptEntity extends BaseEntity {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ type: 'nvarchar' })
	site: string;

	@Column({ type: 'nvarchar' })
	numeroDoRecebimento: string;

	@Column({ type: 'nvarchar' })
	json: string;

	@Column({ type: 'nvarchar' })
	status: string;

	@CreateDateColumn({ type: 'datetime', default: () => 'GETDATE()' })
	createdAt: Date;

	@UpdateDateColumn({ type: 'datetime', default: () => 'GETDATE()' })
	updatedAt: Date;
}
