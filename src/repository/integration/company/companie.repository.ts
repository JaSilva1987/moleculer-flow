import { Errors } from 'moleculer';
import { connectionIntegrador } from '../../../data-source';
import { CompanieEntity } from '../../../entity/integration/companie.entity';
import ICompanie from '../../../interface/integration/company/companie.interface';

export const CompanieRepository = connectionIntegrador
	.getRepository(CompanieEntity)
	.extend({
		async GetCompany(pelican_layer: string): Promise<ICompanie[]> {
			try {
				const result = await this.find({ where: { pelican_layer } });

				if (result == undefined || '' || null)
					throw new Error('Non-existent subsidiary!');

				return result;
			} catch (error) {
				throw new Errors.MoleculerError(error.message, 100);
			}
		}
	});
