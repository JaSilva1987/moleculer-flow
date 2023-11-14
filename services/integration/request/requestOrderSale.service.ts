import * as dotenv from 'dotenv';
import {
	Service as MoleculerService,
	ServiceBroker,
	ServiceSchema
} from 'moleculer';
import { Event, Service } from 'moleculer-decorators';
import { statusStockPFS } from '../../../src/enum/integration/statusStockPfs.enum';
import {
	IItemRequestOrderSalePfsProtheus,
	IRequesOrderSaletPfsProtheus,
	ISendRequestOrderSalePfsProtheus
} from '../../../src/interface/erpProtheus/request/requestOrderSalePfs.interface';
import { IRequestOrderSalePfsIntegration } from '../../../src/interface/integration/request/requestOrderSalePfs.interface';
import { IRequestSalePfs } from '../../../src/interface/sap/request/requestOrderSalePfs.interface';
import { RequestOrderSalePfsIntegrationRepository } from '../../../src/repository/integration/request/requestOrderSalePfs.repository';
import { apmElasticConnect, loggerElastic } from '../../library/elasticSearch';

dotenv.config();

@Service({
	name: 'pfs.integration.requestOrderSale',
	group: 'flow-pfs'
})
export default class RequestOrderSalePfsService extends MoleculerService {
	public constructor(public broker: ServiceBroker, schema: ServiceSchema) {
		super(broker);
	}

	public indexName = 'flow-pfs-requestordersale';
	public serviceName = 'SaveRequestOrderSalePfs.service';
	public originLayer = 'integration';

	@Event({
		name: 'pfs.integration.save.requesteOrderSale',
		group: 'flow-pfs'
	})
	public async requestOrderSalePfsIntermediary(message: IRequestSalePfs) {
		try {
			this.logger.info(
				'==============INTEGRATION REQUEST ORDER SALE=============='
			);

			let response;
			const repository = RequestOrderSalePfsIntegrationRepository;
			const arrayItemRequestOrderSalePfs: IItemRequestOrderSalePfsProtheus[] =
				[];

			for (const itemRequest of message.items) {
				const itemBodyRequesOrderSaletPfs: IItemRequestOrderSalePfsProtheus =
					{
						produto: itemRequest.produto,
						quantidade: itemRequest.quantidade,
						valor_unitario: itemRequest.preco_unitario
					};

				arrayItemRequestOrderSalePfs.push(itemBodyRequesOrderSaletPfs);
			}

			const bodyRequestOrderSalePfs: IRequesOrderSaletPfsProtheus = {
				tipo_triangulacao: message.tipo_triangulacao,
				cnpj_fornecedor: message.cliente,
				items: arrayItemRequestOrderSalePfs
			};

			const registerRequestOrderSalePfs: IRequestOrderSalePfsIntegration =
				{
					cliente: message.cliente,
					num_pedido: message.num_pedido,
					JSON: JSON.stringify(bodyRequestOrderSalePfs),
					status: statusStockPFS.toIntegration,
					createdAt: new Date(),
					updatedAt: new Date()
				};

			const existRegister =
				await repository.GetRequestOrderSalePfsIntegration(
					registerRequestOrderSalePfs.cliente,
					registerRequestOrderSalePfs.num_pedido
				);

			if (existRegister.length > 0) {
				response = await repository.PutRequestOrderSalePfsIntegration(
					registerRequestOrderSalePfs,
					existRegister[0].id
				);
			} else {
				response = await repository.PostRequestOrderSalePfsIntegration(
					registerRequestOrderSalePfs
				);
			}

			if (response.affected > 0 || response.generatedMaps.length > 0) {
				const bodySendPfs: ISendRequestOrderSalePfsProtheus = {
					bodySend: bodyRequestOrderSalePfs,
					register: registerRequestOrderSalePfs
				};

				return await this.broker.broadcast(
					'pfs.erpprotheusviveo.get.requestOrderSale',
					bodySendPfs
				);
			}
		} catch (error) {
			loggerElastic(
				this.indexName,
				error.code,
				this.originLayer,
				this.serviceName,
				JSON.stringify(message),
				JSON.stringify(error.message)
			);
			apmElasticConnect
				.setTransactionName(this.indexName)
				.captureError(new Error(error.message))
				.endTransaction();
		}
	}
}
