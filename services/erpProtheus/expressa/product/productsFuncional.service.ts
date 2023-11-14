import {
	ServiceBroker,
	ServiceSchema,
	Service as MoleculerService
} from 'moleculer';
import * as dotenv from 'dotenv';
import { Event, Service } from 'moleculer-decorators';
import { IGetToken } from '../../../../src/interface/erpProtheus/global';
import {
	INewProductsFuncional,
	TreatmentPProtheus
} from '../../../../src/interface/funcional/product/productsFuncional.interface';
import { AxiosRequestType } from '../../../library/axios';
import {
	loggerElastic,
	apmElasticConnect
} from '../../../library/elasticSearch';
import { TreatmentFuncional } from '../../../../src/enum/funcional/enum';
import { getTokenGlobal } from '../../../library/erpProtheus';

dotenv.config();

@Service({
	name: 'funcional.erpprotheusexpressa.get.products',
	group: 'flow-funcional'
})
export default class ProductsFuncionalService extends MoleculerService {
	filterRequest: string;
	indexName = 'flow-funcional-products';
	isCode = '200';
	originLayer = 'erpprotheusexpressa';
	serviceName = 'ProductsFuncionalService';
	public constructor(public broker: ServiceBroker, schema: ServiceSchema) {
		super(broker);
	}

	@Event({
		name: 'funcional.erpprotheusexpressa.get.products',
		group: 'flow-funcional'
	})
	public async ProductsGet(ctxMessage: INewProductsFuncional) {
		try {
			const token: IGetToken = await getTokenGlobal(
				process.env.PROTHEUSVIVEO_BASEURLFUNCIONAL_EXPRESSA,
				process.env.PROTHEUSVIVEO_RESTFUNCIONAL,
				process.env.PROTHEUSVIVEO_URLTOKEN,
				process.env.PROTHEUSVIVEO_USER,
				process.env.PROTHEUSVIVEO_PASSEXPRESSA
			);

			const urlProtheusConsumer =
				process.env.PROTHEUSVIVEO_BASEURLFUNCIONAL_EXPRESSA +
				process.env.PROTHEUSVIVEO_RESTFUNCIONAL +
				process.env.PROTHEUSVIVEO_FUNCIONAL_REQUEST +
				'products/';

			const requestProtheus = await AxiosRequestType(
				urlProtheusConsumer,
				'',
				'get',
				{ ['Authorization']: 'Bearer ' + token.access_token },
				ctxMessage.urlObj
			);

			loggerElastic(
				this.indexName,
				requestProtheus.status,
				this.originLayer,
				this.serviceName,
				JSON.stringify(ctxMessage),
				JSON.stringify(requestProtheus)
			);

			if (
				requestProtheus.status == 200 ||
				requestProtheus.status == 201
			) {
				const responseProtheus: TreatmentPProtheus = {
					responseTotvs: requestProtheus,
					isValid: true
				};
				loggerElastic(
					this.indexName,
					this.isCode,
					this.originLayer,
					this.serviceName,
					JSON.stringify(ctxMessage),
					JSON.stringify(responseProtheus)
				);
				return responseProtheus;
			} else {
				const responseProtheus: TreatmentPProtheus = {
					responseTotvs: requestProtheus,
					isValid: false
				};
				loggerElastic(
					this.indexName,
					this.isCode,
					this.originLayer,
					this.serviceName,
					JSON.stringify(ctxMessage),
					JSON.stringify(responseProtheus)
				);
				return responseProtheus;
			}
		} catch (error) {
			const responseProtheus: TreatmentPProtheus = {
				responseTotvs: {
					code: error.code,
					message: TreatmentFuncional.not_access
				},
				isValid: false
			};

			loggerElastic(
				this.indexName,
				error.code,
				this.originLayer,
				this.serviceName,
				JSON.stringify(ctxMessage),
				JSON.stringify(error.message)
			);
			apmElasticConnect.captureError(new Error(error.message));

			return responseProtheus;
		}
	}
}
