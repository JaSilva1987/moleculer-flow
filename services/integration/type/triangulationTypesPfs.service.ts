import * as dotenv from 'dotenv';
import {
	Errors,
	Service as MoleculerService,
	ServiceBroker,
	ServiceSchema
} from 'moleculer';
import { Event, Service } from 'moleculer-decorators';
import { apmElasticConnect, loggerElastic } from '../../library/elasticSearch';
import { statusStockPFS } from '../../../src/enum/integration/statusStockPfs.enum';
import { TriangulationTypeIntegrationRepository } from '../../../src/repository/integration/type/triangulationType.repository';
import { ITriangulationType } from '../../../src/interface/erpProtheus/type/triangulationType.interface';
import {
	ITriangulationTypePfs,
	ISendTriangulationTypePfs
} from '../../../src/interface/sap/type/sendTriangulationType.interface';
import { ITriangulationTypeIntegration } from '../../../src/interface/integration/type/triangulatioTypeIntegration.interface';

dotenv.config();

@Service({
	name: 'pfs.integration.triangulationTypesPfs',
	group: 'flow-pfs'
})
export default class TriangulationTypesPfsService extends MoleculerService {
	public constructor(public broker: ServiceBroker, schema: ServiceSchema) {
		super(broker);
	}

	public indexName = 'flow-pfs-triangulationtypespfs';
	public serviceName = 'triangulationTypesPfs.service';
	public originLayer = 'integration';

	@Event({
		name: 'pfs.integration.type.triangulationTypesPfs',
		group: 'flow-pfs'
	})
	public async triangulationTypesPfsIntermediary(
		message: ITriangulationType
	) {
		try {
			const repository = TriangulationTypeIntegrationRepository;

			const sendData: ITriangulationTypePfs = {
				CODIGO: message.referencia,
				DESCRICAO: message.descricao,
				CNPJ: message.items[message.items.length - 1].cnpj_destino
			};
			const insertData: ITriangulationTypeIntegration = {
				triangulationType: sendData.CODIGO,
				returnDataProtheus: JSON.stringify(message),
				status: statusStockPFS.toIntegration,
				createdAt: new Date(),
				updatedAt: new Date(),
				JSON: JSON.stringify(sendData),
				cnpj: sendData.CNPJ
			};

			let existRegister =
				await repository.GetTriangulationTypePfsIntegration(
					sendData.CODIGO
				);

			if (existRegister.length > 0) {
				await repository.PutTriangulationTypePfsIntegration(
					insertData,
					existRegister[0].id
				);
			} else {
				await repository.PostTriangulationTypePfsIntegration(
					insertData
				);
			}

			const sendJson: ISendTriangulationTypePfs = {
				sendJson: sendData,
				data: insertData
			};

			await this.broker.broadcast(
				'service.sap.type.triangulationType.sendTriangulationType',
				sendJson
			);
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
