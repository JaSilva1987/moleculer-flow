import {
	Errors,
	ServiceBroker,
	ServiceSchema,
	Service as MoleculerService
} from 'moleculer';
import * as dotenv from 'dotenv';
import { Event, Service } from 'moleculer-decorators';
import { IGetToken } from '../../../../src/interface/erpProtheus/global';
import {
	INewStocksFuncional,
	TreatmentSProtheus
} from '../../../../src/interface/funcional/stock/stocksFuncional.interface';
import { AxiosRequestType } from '../../../library/axios';
import { getTokenUrlGlobal } from '../../../library/erpProtheus';

dotenv.config();

@Service({
	name: 'funcional.erpprotheusexpressa.stocks',
	group: 'flow-funcional'
})
export default class StocksFuncionalService extends MoleculerService {
	public returnProtheus: any;

	public constructor(public broker: ServiceBroker, schema: ServiceSchema) {
		super(broker);
	}

	@Event({
		name: 'funcional.erpprotheusexpressa.get.stocks',
		group: 'flow-funcional'
	})
	public async StocksGet(ctxMessage: INewStocksFuncional) {
		try {
			const token: IGetToken = await getTokenUrlGlobal(
				process.env.PROTHEUSVIVEO_BASEURLFUNCIONAL_EXPRESSA +
					process.env.PROTHEUSVIVEO_RESTFUNCIONAL +
					process.env.PROTHEUSVIVEO_URLTOKEN +
					process.env.PROTHEUSVIVEO_USER +
					process.env.PROTHEUSVIVEO_PASSEXPRESSA
			);

			const urlProtheusStocks =
				process.env.PROTHEUSVIVEO_BASEURLFUNCIONAL_EXPRESSA +
				process.env.PROTHEUSVIVEO_RESTFUNCIONAL +
				process.env.PROTHEUSVIVEO_FUNCIONAL_REQUEST +
				'stocks/';

			const requestProtheus = await AxiosRequestType(
				urlProtheusStocks,
				'',
				'get',
				{ ['Authorization']: 'Bearer ' + token.access_token },
				ctxMessage.urlObj
			);

			if (
				requestProtheus.status == 200 ||
				requestProtheus.status == 201
			) {
				const responseProtheus: TreatmentSProtheus = {
					responseTotvs: requestProtheus,
					isValid: true
				};

				return responseProtheus;
			} else {
				const responseProtheus: TreatmentSProtheus = {
					responseTotvs: requestProtheus,
					isValid: false
				};

				return responseProtheus;
			}
		} catch (error) {
			throw new Errors.MoleculerRetryableError(error.message, error.code);
		}
	}
}
