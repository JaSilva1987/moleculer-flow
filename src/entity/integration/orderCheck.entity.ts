import { Column, Entity, PrimaryColumn } from 'typeorm';
import { IOrderCheck } from '../../interface/integration/order';

@Entity('order_checks')
export class OrderChecksEntity implements IOrderCheck {
	@PrimaryColumn()
	tenantId: string;

	@PrimaryColumn()
	orderId: string;

	@PrimaryColumn()
	sourceCRM: string;

	@PrimaryColumn()
	checkDescription: string;

	@Column()
	seq: number;

	@Column()
	topicName: string;

	@Column()
	createdAt: Date;

	@Column()
	updatedAt: Date;

	@Column()
	sent: string;

	@Column()
	success: string;

	@Column()
	retryNumber: number;

	@Column()
	nextTry: Date;

	@Column()
	commandSent: string;

	@Column()
	url: string;

	@Column()
	method: string;

	@Column()
	body: string;

	@Column()
	responseCode: number;

	@Column()
	response: string;

	@Column()
	validations_ok: number;
}
