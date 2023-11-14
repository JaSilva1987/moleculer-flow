import * as dotenv from 'dotenv';
import {
	Errors,
	Service as MoleculerService,
	ServiceBroker,
	ServiceSchema
} from 'moleculer';
import { Event, Service } from 'moleculer-decorators';
import { IRequestPfs } from '../../../src/interface/sap/request/requestPfs.interface';
import { apmElasticConnect, loggerElastic } from '../../library/elasticSearch';
import { IRequestPfsIntegration } from '../../../src/interface/integration/request/requestPfs.interface';
import { statusStockPFS } from '../../../src/enum/integration/statusStockPfs.enum';
import {
	IItemRequestPfsProtheus,
	IRequestPfsProtheus,
	ISendRequestPfsProtheus
} from '../../../src/interface/erpProtheus/request/requestPfs.interface';
import { RequestPfsIntegrationRepository } from '../../../src/repository/integration/request/requestPfs.repository';

dotenv.config();

@Service({
	name: 'pfs.integration.request',
	group: 'flow-pfs'
})
export default class RequestPfsService extends MoleculerService {
	public constructor(public broker: ServiceBroker, schema: ServiceSchema) {
		super(broker);
	}

	public indexName = 'flow-pfs-request';
	public serviceName = 'SaveRequestPfs.service';
	public originLayer = 'integration';

	@Event({
		name: 'pfs.integration.save.request',
		group: 'flow-pfs'
	})
	public async requestPfsIntermediary(message: IRequestPfs) {
		try {
			this.logger.info('==============INTEGRATION Request==============');
			let response;
			const repository = RequestPfsIntegrationRepository;
			let arrayItemBodyRequestPfs: IItemRequestPfsProtheus[] = [];

			for (const productItem of message.items) {
				const itemBodyRequestPfs: IItemRequestPfsProtheus = {
					produto: productItem.produto,
					quantidade: productItem.quantidade,
					preco_unitario: productItem.preco_unitario
				};

				arrayItemBodyRequestPfs.push(itemBodyRequestPfs);
			}

			const bodyRequestPfs: IRequestPfsProtheus = {
				tipoID: message.tipo_pedido,
				cnpj_cliente: message.cliente,
				mensagemnota: message.mensagem_nota,
				nat_operacao: message.nat_operacao.toString(),
				items: arrayItemBodyRequestPfs
			};

			const registerRequestPfs: IRequestPfsIntegration = {
				cliente: message.cliente,
				num_pedido: message.num_pedido,
				JSON: JSON.stringify(bodyRequestPfs),
				status: statusStockPFS.toIntegration,
				createdAt: new Date(),
				updatedAt: new Date()
			};

			const existRegister = await repository.GetRequestPfsIntegration(
				message.cliente,
				message.num_pedido
			);

			if (existRegister.length > 0) {
				response = await repository.PutRequestPfsIntegration(
					registerRequestPfs,
					existRegister[0].id
				);
			} else {
				response = await repository.PostRequestPfsIntegration(
					registerRequestPfs
				);
			}

			if (response.affected > 0 || response.generatedMaps.length > 0) {
				const bodySendPfs: ISendRequestPfsProtheus = {
					bodySend: bodyRequestPfs,
					register: registerRequestPfs
				};
				return await this.broker.broadcast(
					'pfs.erpprotheusexpressa.get.request',
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
