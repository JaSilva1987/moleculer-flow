import { Errors } from 'moleculer';
import { connectionIntegrador } from '../../../data-source';
import { CompanyIntegrationEntity } from '../../../entity/integration/companyIntegration.entity';
import { ICompanyIntegration } from '../../../interface/integration/company/companyIntegration.interface';

export const CompanyIntegrationRepository = connectionIntegrador
	.getRepository(CompanyIntegrationEntity)
	.extend({
		async GetCompanyIntegrationByEmpresa(
			empresaIdERP: string,
			filialIdERP: string
		): Promise<ICompanyIntegration[]> {
			try {
				const result = await this.find({
					where: { empresaIdERP, filialIdERP }
				});

				if (result == undefined || '' || null)
					throw new Error('Non-existent subsidiary!');

				return result;
			} catch (error) {
				throw new Errors.MoleculerError(error.message, 100);
			}
		},

		async PostCompanyIntegration(message: ICompanyIntegration) {
			try {
				const postMessage = await this.createQueryBuilder()
					.insert()
					.into(CompanyIntegrationEntity)
					.values(message)
					.execute();

				return postMessage;
			} catch (error) {
				throw new Errors.MoleculerRetryableError(
					error.message,
					error.code
				);
			}
		},

		async PutCompanyIntegration(message: ICompanyIntegration) {
			try {
				const putMessage = await this.createQueryBuilder()
					.update(CompanyIntegrationEntity)
					.set({
						cnpj: message.cnpj,
						updatedAt: new Date()
					})
					.where('empresaIdERP = :empresaIdERP', {
						empresaIdERP: message.empresaIdERP
					})
					.andWhere('filialIdERP = :filialIdERP', {
						filialIdERP: message.filialIdERP
					})
					.execute();

				return putMessage;
			} catch (error) {
				throw new Errors.MoleculerRetryableError(
					error.message,
					error.code
				);
			}
		}
	});
