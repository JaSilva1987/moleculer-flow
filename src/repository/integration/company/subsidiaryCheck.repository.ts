import { Errors } from 'moleculer';
import { connectionIntegrador } from '../../../data-source';
import { SubsidiaryCheckEntity } from '../../../entity/integration/subsidiaryCheck.entity';
import ISubsidiaryCheck from '../../../interface/integration/company/subsidiaryCheck.interface';

export const SubsidiaryCheckRepository = connectionIntegrador
	.getRepository(SubsidiaryCheckEntity)
	.extend({
		async GetSubsidiary(
			cod_empresa_crm: string,
			cod_sistema_crm: number,
			cod_filial_crm: string
		): Promise<ISubsidiaryCheck> {
			try {
				const subsidiaryCondition = await this.findOne({
					where: { cod_empresa_crm, cod_sistema_crm, cod_filial_crm }
				});

				if (subsidiaryCondition == undefined || '' || null)
					throw new Error('Non-existent subsidiary!');

				return subsidiaryCondition;
			} catch (error) {
				throw new Errors.MoleculerError(error.message, 100);
			}
		}
	});
