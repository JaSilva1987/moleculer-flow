import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { ILogFlowIntegration } from '../../interface/integration/configLog/logFlowIntegration.interface';

@Entity('log_Flow')
export class LogFlowIntegrationEntity implements ILogFlowIntegration {
	@PrimaryGeneratedColumn()
	id: number;
	@Column()
	tenantId: string;
	@Column()
	orderId: string;
	@Column()
	sourceCRM: string;
	@Column()
	name: string;
	@Column()
	status: string;
	@Column()
	description: string;
	@Column()
	dateTime: Date;
}
