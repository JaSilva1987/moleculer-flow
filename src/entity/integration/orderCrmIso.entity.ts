import {
	Column,
	CreateDateColumn,
	Entity,
	PrimaryColumn,
	UpdateDateColumn
} from 'typeorm';
import { ISaveOrders } from '../../interface/integration/order/saveOrder.interface';

@Entity({ database: 'integrador', name: 'orders' })
export class OrdersEntity implements ISaveOrders {
	@PrimaryColumn()
	tenantId: string;

	@PrimaryColumn()
	orderId: string;

	@PrimaryColumn()
	sourceCRM: string;

	@CreateDateColumn()
	createdAt: Date;

	@UpdateDateColumn()
	updatedAt: Date;

	@Column()
	json_order: string;

	@Column()
	branchId: string;

	@Column()
	orderIdERP: string;

	@Column()
	status: string;
}
