import * as dotenv from 'dotenv';
import {
	Service as MoleculerService,
	ServiceBroker,
	ServiceSchema
} from 'moleculer';
import { Event, Service } from 'moleculer-decorators';
import moment from 'moment';
import { statusStockPFS } from '../../../src/enum/integration/statusStockPfs.enum';
import { IStockPfsProtheus } from '../../../src/interface/erpProtheus/stock/stockPfs.interface';
import { IStockPfsIntegration } from '../../../src/interface/integration/stock/stockPfs.interface';
import {
	ISendPfs,
	IStockPfs
} from '../../../src/interface/sap/stock/stockPfs.interface';
import { StockPfsIntegrationRepository } from '../../../src/repository/integration/stock/stockPfs.repository';
import { apmElasticConnect, loggerElastic } from '../../library/elasticSearch';

dotenv.config();

@Service({
	name: 'pfs.integration.stocks',
	group: 'flow-pfs'
})
export default class StocksPfsService extends MoleculerService {
	public constructor(public broker: ServiceBroker, schema: ServiceSchema) {
		super(broker);
	}

	public indexName = 'flow-pfs-stock';
	public serviceName = 'SaveStockPfs.service';
	public originLayer = 'integration';

	@Event({
		name: 'pfs.integration.save.stocks',
		group: 'flow-pfs'
	})
	public async stocksPfsIntermediary(ctxMessage: IStockPfsProtheus) {
		try {
			this.logger.info('==============INTEGRATION STOCK==============');
			let response;
			const repository = StockPfsIntegrationRepository;

			const bodySendPfs: IStockPfs = {
				codigo_ean: ctxMessage.codigo_ean.trim(),
				armazem: ctxMessage.loja.trim(),
				data_movimento: moment(ctxMessage.data).format('YYYYMMDD'),
				data_validade: moment(ctxMessage.dt_validade).format(
					'YYYYMMDD'
				),
				saldo_lote: ctxMessage.saldo_lote_segunda_um,
				preco_bruto: ctxMessage.custo_unitario,
				lote: ctxMessage.lote.trim(),
				sub_lote: ctxMessage['sub-lote'],
				data_fabricacao: moment(ctxMessage.data).format('YYYYMMDD')
			};

			const registerStockPfs: IStockPfsIntegration = {
				codigoEan: bodySendPfs.codigo_ean,
				armazen: bodySendPfs.armazem,
				JSON: JSON.stringify(bodySendPfs),
				status: statusStockPFS.toIntegration,
				createdAt: new Date(),
				updatedAt: new Date()
			};

			const existRegister = await repository.GetStockPfsIntegration(
				bodySendPfs.codigo_ean,
				bodySendPfs.armazem
			);

			if (existRegister.length > 0) {
				response = await repository.PutStockPfsIntegration(
					registerStockPfs,
					existRegister[0].id
				);
			} else {
				response = await repository.PostStockPfsIntegration(
					registerStockPfs
				);
			}

			const sendStock: ISendPfs = {
				bodySendPfs: bodySendPfs,
				registerPfs: registerStockPfs
			};

			if (response.affected > 0 || response.generatedMaps.length > 0) {
				await this.broker.broadcast(
					'service.sap.stockpfs.sendStockPfs',
					sendStock
				);
			}
		} catch (error) {
			loggerElastic(
				this.indexName,
				error.code,
				this.originLayer,
				this.serviceName,
				JSON.stringify(ctxMessage),
				JSON.stringify(error.message)
			);

			apmElasticConnect
				.setTransactionName(this.indexName)
				.captureError(new Error(error.message))
				.endTransaction();
		}
	}
}
