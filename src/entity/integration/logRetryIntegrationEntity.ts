import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { ILogsRetryIntegration } from '../../interface/integration/logs/logRetryIntegration.interface';

@Entity('integracao_logs_retry_system')
export class LogsRetryIntegrationEntity implements ILogsRetryIntegration {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	lenght: number;

	@Column()
	executeDate: Date;

	@Column()
	systemName: string;
}
