import {
	Column,
	CreateDateColumn,
	Entity,
	PrimaryGeneratedColumn,
	UpdateDateColumn
} from 'typeorm';

@Entity('integracao_invoice_expedlog')
export class InvoiceExpedLog {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	companyIdentifier: string;

	@Column()
	receivedBody: string;

	@Column({ nullable: true })
	returnedBody: string;

	@Column({ default: false })
	integrated: boolean;

	@CreateDateColumn()
	createdAt: Date;

	@UpdateDateColumn()
	updatedAt?: Date;
}
