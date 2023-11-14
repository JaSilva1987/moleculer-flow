import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { ITriangulationTypeIntegration } from '../../interface/integration/type/triangulatioTypeIntegration.interface';

@Entity('integracao_pfs_request_triangulation_type')
export class triangulationTypeEntity implements ITriangulationTypeIntegration {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	triangulationType: string;

	@Column()
	returnDataProtheus?: string;

	@Column()
	status: string;

	@Column()
	createdAt?: Date;

	@Column()
	updatedAt?: Date;

	@Column()
	JSON?: string;

	@Column()
	cnpj: string;
}
