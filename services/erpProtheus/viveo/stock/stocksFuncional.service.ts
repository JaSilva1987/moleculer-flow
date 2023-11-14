import {
	Errors,
	ServiceBroker,
	ServiceSchema,
	Service as MoleculerService
} from 'moleculer';
import * as dotenv from 'dotenv';
import { Event, Service } from 'moleculer-decorators';
import { getTokenGlobal } from '../../../library/erpProtheus';
import { IGetToken } from '../../../../src/interface/erpProtheus/global';
import {
	INewStocksFuncional,
	TreatmentSProtheus
} from '../../../../src/interface/funcional/stock/stocksFuncional.interface';
import { AxiosRequestType } from '../../../library/axios';

dotenv.config();

@Service({
	name: 'funcional.erpprotheusmafra.stocks',
	group: 'flow-funcional'
})
export default class StocksFuncionalService extends MoleculerService {
	public returnProtheus: any;

	public constructor(public broker: ServiceBroker, schema: ServiceSchema) {
		super(broker);
	}

	@Event({
		name: 'funcional.erpprotheusmafra.get.stocks',
		group: 'flow-funcional'
	})
	public async StocksGet(ctxMessage: INewStocksFuncional) {
		try {
			const token: IGetToken = await getTokenGlobal(
				process.env.PROTHEUSVIVEO_BASEURLFUNCIONAL_VIVEO,
				process.env.PROTHEUSVIVEO_RESTFUNCIONAL,
				process.env.PROTHEUSVIVEO_URLTOKEN,
				process.env.PROTHEUSVIVEO_USER,
				process.env.PROTHEUSVIVEO_PASS
			);

			const urlProtheusStocks =
				process.env.PROTHEUSVIVEO_BASEURLFUNCIONAL_VIVEO +
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
