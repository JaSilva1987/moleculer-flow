import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { IOrderStatusChenge } from '../../interface/integration/order/orderStatusChenge.interface';

@Entity('orders_status_change')
export class updatesErpCheckedStatusChangeEntity implements IOrderStatusChenge {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	runDate: Date;

	@Column()
	runTime: string;

	@Column()
	range: Date;

	@Column()
	tenantId: string;

	@Column()
	branchId: string;

	@Column()
	sourceCRM: string;

	@Column()
	commandSent: string;

	@Column({ type: 'bit' })
	success: boolean;

	@Column()
	responseCode: number;

	@Column()
	response: string;
}
