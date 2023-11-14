import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { IConfigLogCrmIso } from '../../interface/crmIso/config/configLog.interface';

@Entity('LOG_Flow')
export class ConfigLogEntity implements IConfigLogCrmIso {
	@PrimaryGeneratedColumn()
	id: number;
	@Column()
	orderId: string;
	@Column()
	name: string;
	@Column()
	status: string;
	@Column()
	description: string;
	@Column()
	dateTimeSav: Date;
	@Column()
	dateTimeEvt: Date;
	@Column()
	branchId: string;
	@Column()
	orderIdERP: string;
	@Column()
	errorType: number;
	@Column()
	userViewer: string;
}
