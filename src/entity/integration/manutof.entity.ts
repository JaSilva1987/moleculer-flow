import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { IProcessManutOf } from '../../interface/crmIso/orderFat/updateManutOf.interface';

@Entity('integracao_manutof')
export class ManutOfEntity implements IProcessManutOf {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	tenantId: string;

	@Column()
	orderId: string;

	@Column()
	orderIdERP: string;

	@Column()
	branchId: string;

	@Column()
	sourceCRM: string;

	@Column()
	statusCode: number;

	@Column()
	manutType: string;

	@Column()
	jsonCrm: string;

	@Column()
	jsonErp: string;

	@Column()
	createdAt: Date;

	@Column()
	updatedAt: Date;

	@Column()
	status: string;
}
