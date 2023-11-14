import * as dotenv from 'dotenv';
import {
	Service as MoleculerService,
	ServiceBroker,
	ServiceSchema
} from 'moleculer';
import { Event, Service } from 'moleculer-decorators';
import { statusStockPFS } from '../../../../src/enum/integration/statusStockPfs.enum';
import { IGetToken } from '../../../../src/interface/erpProtheus/global';
import { ISendRequestOrderSalePfsProtheus } from '../../../../src/interface/erpProtheus/request/requestOrderSalePfs.interface';
import { RequestOrderSalePfsIntegrationRepository } from '../../../../src/repository/integration/request/requestOrderSalePfs.repository';
import { AxiosRequestType } from '../../../library/axios';
import {
	apmElasticConnect,
	loggerElastic
} from '../../../library/elasticSearch';
import { getTokenUrlGlobal } from '../../../library/erpProtheus';
dotenv.config();

@Service({
	name: 'pfs.erpprotheusviveo.requestordersale',
	group: 'flow-pfs'
})
export default class RequestOrderSalePfsService extends MoleculerService {
	public constructor(public broker: ServiceBroker, schema: ServiceSchema) {
		super(broker);
	}

	public indexName = 'flow-pfs-requestordersale';
	public serviceName = 'PostRequestOrderSalePfs.service';
	public originLayer = 'erpprotheusviveo';

	@Event({
		name: 'pfs.erpprotheusviveo.get.requestOrderSale',
		group: 'flow-pfs'
	})
	public async postRequestOrderSalePfs(
		message: ISendRequestOrderSalePfsProtheus
	) {
		try {
			const repository = RequestOrderSalePfsIntegrationRepository;

			const token: IGetToken = await getTokenUrlGlobal(
				process.env.PROTHEUSVIVEO_TRIANGULACAO_PFS_BASEURL +
					process.env.PROTHEUSVIVEO_URLTOKEN +
					process.env.PROTHEUSVIVEO_USER +
					process.env.PROTHEUSVIVEO_PASS_TRIANGULACAO_PFS
			);

			if (token.access_token) {
				const urlRequest =
					process.env.PROTHEUSVIVEO_TRIANGULACAO_PFS_BASEURL +
					'/ProductTriangulationControl/api/v2/orders/';

				const response = await AxiosRequestType(
					urlRequest,
					message.bodySend,
					'post',
					{
						['Authorization']: 'Bearer ' + token.access_token,
						['TenantId']: '01,001001'
					}
				);

				const existRegister =
					await repository.GetRequestOrderSalePfsIntegration(
						message.register.cliente,
						message.register.num_pedido
					);

				let status: string = '200';
				if (response.status == 201) {
					message.register.status = statusStockPFS.success;
					await repository.PutRequestOrderSalePfsIntegration(
						message.register,
						existRegister[0].id
					);
				} else {
					status = '400';
					message.register.status = `${
						statusStockPFS.erro
					} - ${JSON.stringify(response.message)}`;
					await repository.PutRequestOrderSalePfsIntegration(
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
