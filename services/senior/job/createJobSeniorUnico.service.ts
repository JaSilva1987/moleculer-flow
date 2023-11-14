('use strict');

import {
	Context,
	Errors,
	Service as MoleculerService,
	ServiceBroker
} from 'moleculer';
import {
	ISeniorUnico,
	TCreateJobSeniorUnico
} from '../../../src/interface/senior/job/createJobSeniorUnico.interface';
import { apmElasticConnect, loggerElastic } from '../../library/elasticSearch';

export default class CreateJobUnicoService extends MoleculerService {
	responseApi: any | Array<object>;
	returnResponse: object;
	indexName = 'flow-senior';
	isCode = '200';
	originLayer = 'senior';
	serviceName = 'CreateJobUnicoService';

	public constructor(public broker: ServiceBroker) {
		super(broker);
		this.parseServiceSchema({
			name: 'unico.createjob',
			group: 'flow-senior',
			actions: {
				create: {
					cache: false,
					rest: {
						method: 'POST',
						basePath: 'senior',
						path: '/unico/createjob'
					},
					async handler(unicoSerniorCreate: Context<ISeniorUnico>) {
						return await this.PostCreateJobSeniorUnico(
							unicoSerniorCreate
						);
					}
				}
			}
		});
	}

	public async PostCreateJobSeniorUnico(
		unicoSerniorCreate: Context<ISeniorUnico>
	) {
		try {
			this.logger.info(
				'============== RECEBENDO DADOS PARA CADASTRO DE POSIÇÃO - UNICO PEOLPE =============='
			);

			const emitMessage = unicoSerniorCreate.params;

			this.responseApi = await this.broker.emit(
				'senior.unico.integration.post.createjob',
				emitMessage
			);

			loggerElastic(
				this.indexName,
				this.isCode,
				this.originLayer,
				this.serviceName,
				JSON.stringify(unicoSerniorCreate.params),
				JSON.stringify(this.responseApi)
			);

			this.responseApi.forEach((respRoute: object) => {
				this.returnResponse = respRoute;
			});

			const setResponse: TCreateJobSeniorUnico = this.returnResponse;

			loggerElastic(
				this.indexName,
				this.isCode,
				this.originLayer,
				this.serviceName,
				JSON.stringify(unicoSerniorCreate.params),
				JSON.stringify(this.returnResponse)
			);

			if (Number(setResponse.status) === 200) {
				return Promise.resolve(setResponse);
			} else {
				return Promise.reject(
					new Errors.MoleculerError(
						setResponse.message !== undefined
							? setResponse.message
							: JSON.stringify(setResponse),
						setResponse.status !== undefined
							? Number(setResponse.status)
							: 400
					)
				);
			}
		} catch (error) {
			loggerElastic(
				this.indexName,
				'499',
				this.originLayer,
				this.serviceName,
				JSON.stringify(unicoSerniorCreate.params),
				JSON.stringify(error.message)
			);
		}
	}
}
