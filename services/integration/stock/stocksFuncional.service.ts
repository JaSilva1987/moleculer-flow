import {
	Errors,
	ServiceBroker,
	ServiceSchema,
	Service as MoleculerService
} from 'moleculer';
import * as dotenv from 'dotenv';
import { Service, Event } from 'moleculer-decorators';
import {
	INewStocksFuncional,
	IStocksFuncional
} from '../../../src/interface/funcional/stock/stocksFuncional.interface';
import StocksFuncionalBusinessRule from '../../../src/controller/integration/stock/stocksFuncional.controller';

dotenv.config();

@Service({
	name: 'funcional.integration.stocks',
	group: 'flow-funcional'
})
export default class StocksFuncionalService extends MoleculerService {
	instanceController: StocksFuncionalBusinessRule;
	responseMafra: any | object;
	responseExpressa: any | object;
	globalReturn: any | object;
	public constructor(public broker: ServiceBroker, schema: ServiceSchema) {
		super(broker);
	}
	@Event({
		name: 'funcional.integration.get.stocks',
		group: 'flow-funcional'
	})
	public async stocksFuncionalIntermediary(ctxMessage: IStocksFuncional) {
		try {
			this.instanceController = new StocksFuncionalBusinessRule();

			const businessRule: INewStocksFuncional =
				await this.instanceController.validatesRoutes(ctxMessage);
			switch (businessRule.protheus) {
				case 'mafra':
					this.responseMafra = await this.broker.emit(
						'funcional.erpprotheusmafra.get.stocks',
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
						'funcional.erpprotheusexpressa.get.stocks',
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
						'funcional.crmmoney.get.stocks',
						businessRule
					);

					const resGlobal =
						await this.instanceController.treatementResponseGlobal(
							this.responseMafra
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

				return this.globalReturn;
			} else {
				return this.globalReturn;
			}
		} catch (error) {
			throw new Errors.MoleculerError(error.message, error.code);
		}
	}
}
