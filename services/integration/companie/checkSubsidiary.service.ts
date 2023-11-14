import {
	Context,
	Service as MoleculerService,
	ServiceBroker,
	ServiceSchema
} from 'moleculer';
import { Action, Service } from 'moleculer-decorators';
import SubsidiaryCheckController from '../../../src/controller/integration/companie/subsidiaryCheck.controller';
import { connectionIntegrador } from '../../../src/data-source';
import ISubsidiaryCheck from '../../../src/interface/integration/company/subsidiaryCheck.interface';
import { loggerElastic } from '../../library/elasticSearch';

@Service({
	name: 'subsidiaryCheck',
	group: 'flow-cremmer'
})
export default class SubsidiaryCheck extends MoleculerService {
	public checkSubCrm: any;
	public objParams: any;
	public errorMessage = 'Não existe subsidiary';
	public indexName = 'flow-integration-api';
	public serviceName = 'subsidiaryCheck.service';
	public originLayer = 'integration';
	public statusElastic: '200';
	public noData = 'Não ha dados';
	public sucessSend = 'Consultation carried out';
	public returnEmpty = 'Subsidiary controller query error';

	public constructor(public broker: ServiceBroker, schema: ServiceSchema) {
		super(broker);
	}

	async started() {
		try {
			await connectionIntegrador.initialize();
		} catch (error) {
			loggerElastic(
				this.indexName,
				'500',
				this.originLayer,
				this.serviceName,
				'',
				JSON.stringify(error.message)
			);
			this.logger.error(error.message, 500);
		}
	}

	@Action({
		cache: false,
		rest: 'GET subsidiary/',
		params: {
			cod_empresa_crm: 'string',
			cod_sistema_crm: 'string',
			cod_filial_crm: 'string'
		},
		name: 'service.integration.checkSubsidiary',
		description: 'teste',
		group: 'flow-cremer'
	})
	public async GetCheckSubsidiary(ctx: Context<ISubsidiaryCheck>) {
		try {
			this.objParams = ctx.params;

			const checkCondition = new SubsidiaryCheckController(
				this.objParams
			);

			this.checkSubCrm = await checkCondition.SubsidiaryCheckAll(
				this.objParams
			);

			this.jsonReturn = {
				empresaCrm: this.checkSubCrm.cod_empresa_crm,
				codigoCrm: this.checkSubCrm.cod_sistema_crm,
				filialCrm: this.checkSubCrm.cod_filial_crm,
				empresaErp: this.checkSubCrm.cod_empresa_erp,
				codigoErp: this.checkSubCrm.cod_sistema_erp,
				filialErp: this.checkSubCrm.cod_filial_erp
			};

			if (this.checkSubCrm) {
				loggerElastic(
					this.indexName,
					this.statusElastic,
					this.originLayer,
					this.serviceName,
					JSON.stringify(this.objParams),
					JSON.stringify(this.jsonReturn)
				);

				return {
					code: 201,
					message: this.jsonReturn,
					status: 'Sucesso'
				};
			} else {
				loggerElastic(
					this.indexName,
					this.statusElastic,
					this.originLayer,
					this.serviceName,
					JSON.stringify(this.objParams),
					JSON.stringify(this.checkSubCrm)
				);

				return {
					code: 401,
					message: this.errorMessage,
					status: 'Error'
				};
			}
		} catch (error) {
			loggerElastic(
				this.indexName,
				'499',
				this.originLayer,
				this.serviceName,
				JSON.stringify(this.objParams),
				JSON.stringify(error.message)
			);
		}
	}

	async stoped() {
		return await connectionIntegrador.destroy();
	}
}
