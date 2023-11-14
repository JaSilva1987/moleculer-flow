'use strict';

import * as dotenv from 'dotenv';
import {
	Errors,
	Service as MoleculerService,
	ServiceBroker,
	ServiceSchema
} from 'moleculer';
import { Event, Service } from 'moleculer-decorators';
import { apmElasticConnect, loggerElastic } from '../../library/elasticSearch';
import { AxiosRequestWithOutAuth } from '../../library/axios';
import { ISendTriangulationTypePfs } from '../../../src/interface/sap/type/sendTriangulationType.interface';
import { TriangulationTypeIntegrationRepository } from '../../../src/repository/integration/type/triangulationType.repository';
import { statusStockPFS } from '../../../src/enum/integration/statusStockPfs.enum';

dotenv.config();

@Service({
	name: 'sap.pfs.type.sendTriangulationType',
	group: 'flow-pfs'
})
export default class SendTriangulationTypePfs extends MoleculerService {
	public constructor(public broker: ServiceBroker, schema: ServiceSchema) {
		super(broker);
	}

	public indexName = 'flow-pfs-type-triangulationtype';
	public serviceName = 'sendTriangulationType.service';
	public originLayer = 'sap';

	@Event({
		name: 'service.sap.type.triangulationType.sendTriangulationType',
		group: 'flow-pfs'
	})
	public async sendTriangulationType(message: ISendTriangulationTypePfs) {
		try {
			this.logger.info(
				'==============ENVIA DADOS DO TIPOS DE TRIANGULAÇÃO A PFS=============='
			);

			const response = await AxiosRequestWithOutAuth(
				process.env.SAP_BASEURL + `rota/AtualizaRota`,
				[message.sendJson],
				'put'
			);

			if (response.status == 200) {
				const repository = TriangulationTypeIntegrationRepository;

				const existRegister =
					await repository.GetTriangulationTypePfsIntegration(
						message.data.triangulationType
					);

				if (existRegister.length > 0) {
					message.data.status = statusStockPFS.success;
					await repository.PutTriangulationTypePfsIntegration(
						message.data,
						existRegister[0].id
					);
				}
			}
			loggerElastic(
				this.indexName,
				response.status.toString() ? '200' : '400',
				this.originLayer,
				this.serviceName,
				`PUT ${process.env.SAP_BASEURL}rota/AtualizaRota`,
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
