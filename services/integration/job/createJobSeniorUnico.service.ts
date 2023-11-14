('use strict');

import { Service as MoleculerService, ServiceBroker } from 'moleculer';
import { Event, Service } from 'moleculer-decorators';
import { CreateJobUnicoController } from '../../../src/controller/integration/job/createJobSeniorUnico.controller';
import {
	IControllerUnico,
	ISeniorUnico
} from '../../../src/interface/senior/job/createJobSeniorUnico.interface';
import { loggerElastic } from '../../library/elasticSearch';

@Service({
	name: 'senior.unico.integration.createjob',
	group: 'flow-senior'
})
export default class CreateJobUnicoService extends MoleculerService {
	responseApi: any | Array<object>;
	indexName = 'flow-senior';
	isCode = '200';
	originLayer = 'integration';
	serviceName = 'CreateJobUnicoService';

	public constructor(public broker: ServiceBroker) {
		super(broker);
	}

	@Event({
		name: 'senior.unico.integration.post.createjob',
		group: 'flow-senior'
	})
	public async PostCreateJobSeniorUnico(unicoSerniorCreate: ISeniorUnico) {
		try {
			this.logger.info(
				'============== RECEBENDO DADOS PARA VALIDAÇÃO - UNICO PEOPLE =============='
			);
			const isValid = new CreateJobUnicoController(this.broker);
			const sendUnico = await isValid.checkJsonValid(unicoSerniorCreate);
			const returnCtrl: IControllerUnico = JSON.parse(
				JSON.stringify(sendUnico)
			);

			if (returnCtrl.status === 200) {
				this.responseApi = await this.broker.emit(
					'senior.unico.post.createjob',
					sendUnico
				);

				loggerElastic(
					this.indexName,
					this.isCode,
					this.originLayer,
					this.serviceName,
					JSON.stringify(unicoSerniorCreate),
					JSON.stringify(this.responseApi)
				);

				this.responseApi.forEach((respRoute: object) => {
					this.returnResponse = respRoute;
				});
			} else {
				this.returnResponse = {
					status: returnCtrl.status,
					message: returnCtrl.message
				};
			}

			loggerElastic(
				this.indexName,
				this.isCode,
				this.originLayer,
				this.serviceName,
				JSON.stringify(unicoSerniorCreate),
				JSON.stringify(this.returnResponse)
			);

			return this.returnResponse;
		} catch (error) {
			this.logger.warn(
				'============== ERRO VALIDAÇÃO - UNICO PEOPLE =============='
			);

			loggerElastic(
				this.indexName,
				'499',
				this.originLayer,
				this.serviceName,
				JSON.stringify(unicoSerniorCreate),
				JSON.stringify(error.message)
			);
		}
	}
}
