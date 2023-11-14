import { Errors } from 'moleculer';
import {
	apmElasticConnect,
	loggerElastic
} from '../../../../services/library/elasticSearch';
import { connectionIntegrador } from '../../../data-source';
import ISubsidiaryCheck from '../../../interface/integration/company/subsidiaryCheck.interface';
import { SubsidiaryCheckRepository } from '../../../repository/integration/company/subsidiaryCheck.repository';

export default class SubsidiaryCheckController implements ISubsidiaryCheck {
	public indexName = 'flow-integration-routeorders';
	public serviceName = 'poolOrders.controller';
	public originLayer = 'integration';
	public returnEmpty = 'There is no data';
	public noData = 'Não ha dados';
	public id: number;
	public cod_empresa_crm: string;
	public cod_sistema_crm: number | string;
	public cod_filial_crm: string;
	public cod_empresa_erp: string;
	public cod_sistema_erp: number;
	public cod_filial_erp: string;
	public checkCondition: any;
	public jsonReturn: any;

	public constructor(message: ISubsidiaryCheck) {
		try {
			this.cod_empresa_crm = message.cod_empresa_crm;
			this.cod_sistema_crm = Number(message.cod_sistema_crm);
			this.cod_filial_crm = message.cod_filial_crm;
			if (
				this.cod_empresa_crm == undefined ||
				this.cod_sistema_crm == undefined ||
				this.cod_filial_crm == undefined
			)
				throw process.env.MESSAGE_SUBSIDIARY_THROW;
		} catch (err) {
			apmElasticConnect.captureError(new Error(err.message));
			throw new Errors.MoleculerError(err.message, err.code);
		}
	}

	public async SubsidiaryCheckAll(
		message: ISubsidiaryCheck
	): Promise<SubsidiaryCheckController> {
		try {
			this.checkCondition = SubsidiaryCheckRepository.GetSubsidiary(
				message.cod_empresa_crm,
				Number(message.cod_sistema_crm),
				message.cod_filial_crm
			);

			return this.checkCondition;
		} catch (error) {
			loggerElastic(
				this.indexName,
				'499',
				this.originLayer,
				this.serviceName,
				JSON.stringify(message),
				JSON.stringify(error.message)
			);
			apmElasticConnect.captureError(new Error(error.message));
			throw new Errors.MoleculerError(error.message, error.code);
		}
	}
}
