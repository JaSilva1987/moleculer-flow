import { ICompanyERPProtheus } from '../../../interface/erpProtheus/company';
import { ICompanyIntegration } from '../../../interface/integration/company/companyIntegration.interface';
import { CompanyIntegrationRepository } from '../../../repository/integration/company/companyIntegration.repository';

export default class CompanyIntegrationController {
	public companyStatus: boolean = false;
	public async companyIntegration(message: ICompanyERPProtheus) {
		const response =
			await CompanyIntegrationRepository.GetCompanyIntegrationByEmpresa(
				message.companyId,
				message.branchId
			);

		const msgCompany: ICompanyIntegration = {
			conector: 'pelican',
			empresaIdERP: message.companyId,
			filialIdERP: message.branchId,
			cnpj: message.federalId,
			tipoErp: 'Mafra',
			nomeCliente: 'Protheus_Pelican',
			ativo: 'S',
			insertedAt: new Date(),
			updatedAt: new Date()
		};

		if (response.length == 0) {
			const returnInsert =
				await CompanyIntegrationRepository.PostCompanyIntegration(
					msgCompany
				);

			if (returnInsert.affected > 0) this.companyStatus = true;
		} else {
			const returnUpdate =
				await CompanyIntegrationRepository.PutCompanyIntegration(
					msgCompany
				);

			if (returnUpdate.affected > 0) this.companyStatus = true;
		}

		return this.companyStatus;
	}

	public async getIdFilial(companyId: string, filialId: string) {
		const response =
			await CompanyIntegrationRepository.GetCompanyIntegrationByEmpresa(
				companyId,
				filialId
			);

		return response;
	}
}
