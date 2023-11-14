import {
	Errors,
	ServiceBroker,
	ServiceSchema,
	Service as MoleculerService
} from 'moleculer';
import * as dotenv from 'dotenv';
import { Event, Service } from 'moleculer-decorators';
import { AxiosRequestSimple } from '../../library/axios';
import {
	INewStocksFuncional,
	TreatmentSProtheus
} from '../../../src/interface/funcional/stock/stocksFuncional.interface';

dotenv.config();

@Service({
	name: 'funcional.crmmoney.stocks',
	group: 'flow-funcional'
})
export default class StocksFuncionalService extends MoleculerService {
	public returnProtheus: any;

	public constructor(public broker: ServiceBroker, schema: ServiceSchema) {
		super(broker);
	}

	@Event({
		name: 'funcional.crmmoney.get.stocks',
		group: 'flow-funcional'
	})
	public async StocksGet(ctxMessage: INewStocksFuncional) {
		try {
			const urlMoney = process.env.URLMONEY;

			const filterEan =
				ctxMessage.codeEAN != '0'
					? `petrobras_get_stock?codeEAN=${ctxMessage.codeEAN}`
					: 'petrobras_get_stock';

			const stocksMoney = await AxiosRequestSimple(
				urlMoney + filterEan,
				'get'
			);

			if (stocksMoney.status == 200 || stocksMoney.status == 201) {
				const responseMoney: TreatmentSProtheus = {
					responseTotvs: stocksMoney,
					isValid: true
				};

				return responseMoney;
			} else {
				const responseMoney: TreatmentSProtheus = {
					responseTotvs: stocksMoney,
					isValid: false
				};

				return responseMoney;
			}
		} catch (error) {
			throw new Errors.MoleculerRetryableError(error.message, error.code);
		}
	}
}
