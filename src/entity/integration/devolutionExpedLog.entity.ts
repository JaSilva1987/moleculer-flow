import {
	Column,
	CreateDateColumn,
	Entity,
	PrimaryGeneratedColumn,
	UpdateDateColumn
} from 'typeorm';

@Entity('integracao_devolution_expedlog')
export class DevolutionExpedLog {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({nullable: true})
	companyName: string;

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
