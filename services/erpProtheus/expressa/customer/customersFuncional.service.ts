import {
	ServiceBroker,
	ServiceSchema,
	Service as MoleculerService
} from 'moleculer';
import * as dotenv from 'dotenv';
import { Event, Service } from 'moleculer-decorators';
import {
	INewCustomersFuncional,
	TreatmentProtheus
} from '../../../../src/interface/funcional/customer/customersFuncional.interface';
import { IGetToken } from '../../../../src/interface/erpProtheus/global';
import { getTokenGlobal } from '../../../library/erpProtheus';
import { AxiosRequestType } from '../../../library/axios';
import {
	apmElasticConnect,
	loggerElastic
} from '../../../library/elasticSearch';
import { TreatmentFuncional } from '../../../../src/enum/funcional/enum';
dotenv.config();

@Service({
	name: 'funcional.erpprotheusexpressa.get.customer',
	group: 'flow-funcional'
})
export default class CustomersFuncionalService extends MoleculerService {
	indexName = 'flow-funcional-customers';
	isCode = '200';
	originLayer = 'erpprotheusexpressa';
	serviceName = 'CustomersFuncionalService';
	public constructor(public broker: ServiceBroker, schema: ServiceSchema) {
		super(broker);
	}

	@Event({
		name: 'funcional.erpprotheusexpressa.get.customer',
		group: 'flow-funcional'
	})
	public async CustomersGet(ctxMessage: INewCustomersFuncional) {
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
				'customers/';

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
				const responseProtheus: TreatmentProtheus = {
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
				const responseProtheus: TreatmentProtheus = {
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
			const responseProtheus: TreatmentProtheus = {
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
