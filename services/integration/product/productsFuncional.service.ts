import {
	Errors,
	ServiceBroker,
	ServiceSchema,
	Service as MoleculerService
} from 'moleculer';
import * as dotenv from 'dotenv';
import { Service, Event } from 'moleculer-decorators';
import {
	INewProductsFuncional,
	IProductsFuncional
} from '../../../src/interface/funcional/product/productsFuncional.interface';
import ProductsFuncionalBusinessRule from '../../../src/controller/integration/products/productsFuncional.controller';
import { apmElasticConnect, loggerElastic } from '../../library/elasticSearch';

dotenv.config();

@Service({
	name: 'funcional.integration.products',
	group: 'flow-funcional'
})
export default class ProductsFuncionalService extends MoleculerService {
	instanceController: ProductsFuncionalBusinessRule;
	responseMafra: any | object;
	responseExpressa: any | object;
	globalReturn: any | object;
	indexName = 'flow-funcional-products';
	isCode = '200';
	originLayer = 'integration';
	serviceName = 'ProductsFuncionalService';
	public constructor(public broker: ServiceBroker, schema: ServiceSchema) {
		super(broker);
	}
	@Event({
		name: 'funcional.integration.get.products',
		group: 'flow-funcional'
	})
	public async productsFuncionalIntermediary(ctxMessage: IProductsFuncional) {
		try {
			this.instanceController = new ProductsFuncionalBusinessRule();

			const businessRule: INewProductsFuncional =
				await this.instanceController.validatesRoutes(ctxMessage);
			switch (businessRule.protheus) {
				case 'mafra':
					this.responseMafra = await this.broker.emit(
						'funcional.erpprotheusmafra.get.products',
						businessRule
					);

					const resMafra =
						await this.instanceController.treatementResponseMafra(
							this.responseMafra
						);
					loggerElastic(
						this.indexName,
						this.isCode,
						this.originLayer,
						this.serviceName,
						JSON.stringify(businessRule),
						JSON.stringify(resMafra)
					);
					this.globalReturn = resMafra;
					break;
				case 'expressa':
					this.responseExpressa = await this.broker.emit(
						'funcional.erpprotheusexpressa.get.products',
						businessRule
					);

					const resExpressa =
						await this.instanceController.treatementResponseExpressa(
							this.responseExpressa
						);
					loggerElastic(
						this.indexName,
						this.isCode,
						this.originLayer,
						this.serviceName,
						JSON.stringify(businessRule),
						JSON.stringify(resExpressa)
					);
					this.globalReturn = resExpressa;
					break;
				default:
					this.responseMafra = await this.broker.emit(
						'funcional.erpprotheusmafra.get.products',
						businessRule
					);

					this.responseExpressa = await this.broker.emit(
						'funcional.erpprotheusexpressa.get.products',
						businessRule
					);

					const resGlobal =
						await this.instanceController.treatementResponseGlobal(
							this.responseMafra,
							this.responseExpressa
						);

					loggerElastic(
						this.indexName,
						this.isCode,
						this.originLayer,
						this.serviceName,
						JSON.stringify(businessRule),
						JSON.stringify(resGlobal)
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
