'use strict';

import {
	Errors,
	Service as MoleculerService,
	ServiceBroker,
	ServiceSchema
} from 'moleculer';
import { Event, Service } from 'moleculer-decorators';
import * as dotenv from 'dotenv';
import { apmElasticConnect, loggerElastic } from '../../library/elasticSearch';
import { ISendPfs } from '../../../src/interface/sap/stock/stockPfs.interface';
import { AxiosRequestWithOutAuth } from '../../library/axios';
import { StockPfsIntegrationRepository } from '../../../src/repository/integration/stock/stockPfs.repository';
import { statusStockPFS } from '../../../src/enum/integration/statusStockPfs.enum';

dotenv.config();
@Service({
	name: 'sap.pfs.stock',
	group: 'flow-pfs'
})
export default class SendStock extends MoleculerService {
	public constructor(public broker: ServiceBroker, schema: ServiceSchema) {
		super(broker);
	}

	public indexName = 'flow-pfs-stock';
	public serviceName = 'stockPfs.service';
	public originLayer = 'sap';

	@Event({
		name: 'service.sap.stockpfs.sendStockPfs',
		group: 'flow-pfs'
	})
	public async sendStockPfs(sendPfs: ISendPfs) {
		try {
			this.logger.info(
				'==============ENVIA DADOS DO STOCK A PFS=============='
			);

			const response: any = await AxiosRequestWithOutAuth(
				process.env.SAP_BASEURL + `estoque/AtualizaEstoque`,
				[sendPfs.bodySendPfs],
				'put'
			);

			const repository = StockPfsIntegrationRepository;

			const existRegister = await repository.GetStockPfsIntegration(
				sendPfs.bodySendPfs.codigo_ean,
				sendPfs.bodySendPfs.armazem
			);

			if (response.status == 200) {
				sendPfs.registerPfs.status = statusStockPFS.success;
				await repository.PutStockPfsIntegration(
					sendPfs.registerPfs,
					existRegister[0].id
				);
			} else {
				sendPfs.registerPfs.status = `${
					statusStockPFS.erro
				} - ${JSON.stringify(response.message?.response?.data[0])}`;
				await repository.PutStockPfsIntegration(
					sendPfs.registerPfs,
					existRegister[0].id
				);
			}

			loggerElastic(
				this.indexName,
				response.status.toString(),
				this.originLayer,
				this.serviceName,
				`PUT ${process.env.SAP_BASEURL}estoque/AtualizaEstoque`,
				JSON.stringify(response.message)
			);
		} catch (error) {
			loggerElastic(
				this.indexName,
				'499',
				this.originLayer,
				this.serviceName,
				JSON.stringify(error.message)
			);

			apmElasticConnect
				.setTransactionName(this.indexName)
				.captureError(new Error(error.message))
				.endTransaction();
		}
	}
}
