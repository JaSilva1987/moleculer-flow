import * as dotenv from 'dotenv';
import {
	Errors,
	Service as MoleculerService,
	ServiceBroker,
	ServiceSchema
} from 'moleculer';
import { Event, Service } from 'moleculer-decorators';
import { statusStockPFS } from '../../../../src/enum/integration/statusStockPfs.enum';
import { IGetToken } from '../../../../src/interface/erpProtheus/global';
import { ISendRequestPfsProtheus } from '../../../../src/interface/erpProtheus/request/requestPfs.interface';
import { RequestPfsIntegrationRepository } from '../../../../src/repository/integration/request/requestPfs.repository';
import { AxiosRequestType } from '../../../library/axios';
import {
	loggerElastic,
	apmElasticConnect
} from '../../../library/elasticSearch';
import { getTokenUrlGlobal } from '../../../library/erpProtheus';

dotenv.config();

@Service({
	name: 'pfs.erpprotheusexpressa.request',
	group: 'flow-pfs'
})
export default class RequestPfsService extends MoleculerService {
	public constructor(public broker: ServiceBroker, schema: ServiceSchema) {
		super(broker);
	}

	public indexName = 'flow-pfs-request';
	public serviceName = 'PostRequestPfs.service';
	public originLayer = 'erpprotheusexpressa';

	@Event({
		name: 'pfs.erpprotheusexpressa.get.request',
		group: 'flow-pfs'
	})
	public async postRequestPfs(message: ISendRequestPfsProtheus) {
		try {
			const repository = RequestPfsIntegrationRepository;

			const token: IGetToken = await getTokenUrlGlobal(
				process.env.PROTHEUSVIVEO_BASEURLAPFS_EXPRESSA +
					process.env.PROTHEUSVIVEO_RESTFUNCIONAL +
					process.env.PROTHEUSVIVEO_URLTOKEN +
					process.env.PROTHEUSVIVEO_USER +
					process.env.PROTHEUSVIVEO_PASSEXPRESSA
			);

			if (token.access_token) {
				const urlRequest =
					process.env.PROTHEUSVIVEO_BASEURLAPFS_EXPRESSA +
					process.env.PROTHEUSVIVEO_RESTFUNCIONAL +
					'/ReturnableBatchStock/api/v1/orders';

				const response = await AxiosRequestType(
					urlRequest,
					message.bodySend,
					'post',
					{
						['Authorization']: 'Bearer ' + token.access_token,
						['TenantId']: '01,0675'
					}
				);

				const existRegister = await repository.GetRequestPfsIntegration(
					message.register.cliente,
					message.register.num_pedido
				);

				let status: string = '200';
				if (response.status == 201) {
					message.register.status = statusStockPFS.success;
					await repository.PutRequestPfsIntegration(
						message.register,
						existRegister[0].id
					);
				} else {
					status = '400';
					message.register.status = `${
						statusStockPFS.erro
					} - ${JSON.stringify(response.message)}`;
					await repository.PutRequestPfsIntegration(
						message.register,
						existRegister[0].id
					);
				}

				loggerElastic(
					this.indexName,
					status,
					this.originLayer,
					this.serviceName,
					`GET ${urlRequest}`,
					JSON.stringify(response.message)
				);

				return response;
			} else {
				loggerElastic(
					this.indexName,
					'400',
					this.originLayer,
					this.serviceName,
					'Token não gerado'
				);
			}
		} catch (error) {
			loggerElastic(
				this.indexName,
				error.code,
				this.originLayer,
				this.serviceName,
				'',
				JSON.stringify(error.message)
			);

			apmElasticConnect
				.setTransactionName(this.indexName)
				.captureError(new Error(error.message))
				.endTransaction();
		}
	}
}
