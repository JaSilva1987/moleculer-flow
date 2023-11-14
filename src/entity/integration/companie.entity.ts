import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';
import ICompanie from '../../interface/integration/company/companie.interface';

@Entity('integracao_config')
export class CompanieEntity implements ICompanie {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	company: string;

	@Column()
	subsidiary: string;

	@Column()
	comprovei_layer: string;

	@Column()
	pelican_layer: string;
}
