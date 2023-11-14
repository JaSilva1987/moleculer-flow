import {
	Errors,
	Service as MoleculerService,
	ServiceBroker,
	ServiceSchema
} from 'moleculer';
import { Event, Service } from 'moleculer-decorators';
import CustomersFuncionalBusinessRule from '../../../src/controller/integration/customer/customersFuncional.controller';
import {
	ICustomersFuncional,
	INewCustomersFuncional
} from '../../../src/interface/funcional/customer/customersFuncional.interface';
import { apmElasticConnect, loggerElastic } from '../../library/elasticSearch';

@Service({
	name: 'funcional.integration.customer',
	group: 'flow-funcional'
})
export default class CustomersFuncionalService extends MoleculerService {
	instanceController: CustomersFuncionalBusinessRule;
	responseMafra: any | object;
	responseExpressa: any | object;
	globalReturn: any | object;
	indexName = 'flow-funcional-customers';
	isCode = '200';
	originLayer = 'integration';
	serviceName = 'CustomersFuncionalService';

	public constructor(public broker: ServiceBroker, schema: ServiceSchema) {
		super(broker);
	}
	@Event({
		name: 'funcional.integration.get.customer',
		group: 'flow-funcional'
	})
	public async customerFuncionalIntermediary(
		ctxMessage: ICustomersFuncional
	) {
		try {
			this.instanceController = new CustomersFuncionalBusinessRule();

			const businessRule: INewCustomersFuncional =
				await this.instanceController.validatesRoutes(ctxMessage);
			switch (businessRule.protheus) {
				case 'mafra':
					this.responseMafra = await this.broker.emit(
						'funcional.erpprotheusmafra.get.customer',
						businessRule
					);

					const resMafra =
						await this.instanceController.treatementResponseMafra(
							this.responseMafra
						);

					this.globalReturn = resMafra;
					break;
				case 'expressa':
					this.responseExpressa = await this.broker.emit(
						'funcional.erpprotheusexpressa.get.customer',
						businessRule
					);

					const resExpressa =
						await this.instanceController.treatementResponseExpressa(
							this.responseExpressa
						);

					this.globalReturn = resExpressa;
					break;
				default:
					this.responseMafra = await this.broker.emit(
						'funcional.erpprotheusmafra.get.customer',
						businessRule
					);

					this.responseExpressa = await this.broker.emit(
						'funcional.erpprotheusexpressa.get.customer',
						businessRule
					);

					const resGlobal =
						await this.instanceController.treatementResponseGlobal(
							this.responseMafra,
							this.responseExpressa
						);

					this.globalReturn = resGlobal;
					break;
			}

			if (ctxMessage.pageNumber != undefined) {
				Object.assign(this.globalReturn.viveo, {
					pageNumber:
						ctxMessage.pageNumber != undefined
							? ctxMessage.pageNumber
							: 0,
					pageSize:
						ctxMessage.pageSize != undefined
							? ctxMessage.pageSize
							: 0
				});

				loggerElastic(
					this.indexName,
					this.isCode,
					this.originLayer,
					this.serviceName,
					JSON.stringify(ctxMessage),
					JSON.stringify(this.globalReturn)
				);

				return this.globalReturn;
			} else {
				loggerElastic(
					this.indexName,
					this.isCode,
					this.originLayer,
					this.serviceName,
					JSON.stringify(ctxMessage),
					JSON.stringify(this.globalReturn)
				);
				return this.globalReturn;
			}
		} catch (error) {
			loggerElastic(
				this.indexName,
				error.code,
				this.originLayer,
				this.serviceName,
				JSON.stringify(ctxMessage),
				JSON.stringify(error.message)
			);
			apmElasticConnect.captureError(new Error(error.message));
			throw new Errors.MoleculerError(error.message, error.code);
		}
	}
}
