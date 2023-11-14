('use strict');
import { Service as MoleculerService, ServiceBroker } from 'moleculer';
import { Event, Service } from 'moleculer-decorators';
import { IUnicoStatus } from '../../../src/interface/unico/createJobSeniorUnico.interface';
import { loggerElastic } from '../../library/elasticSearch';

@Service({
	name: 'senior.unico.integration.candidatehired',
	group: 'flow-senior'
})
export default class CandidateHiredUnicoService extends MoleculerService {
	responseApi: any | Array<object>;
	returnResponse: object;
	indexName = 'flow-senior';
	isCode = '200';
	originLayer = 'integration';
	serviceName = 'CandidateHiredService';

	public constructor(public broker: ServiceBroker) {
		super(broker);
	}

	@Event({
		name: 'senior.unico.integration.post.candidatehired',
		group: 'flow-senior'
	})
	public async PostCandidateHiredSeniorunico(
		unicoSerniorCandidate: IUnicoStatus
	) {
		try {
			this.responseApi = await this.broker.emit(
				'senior.unico.post.candidatehired',
				unicoSerniorCandidate
			);

			loggerElastic(
				this.indexName,
				this.isCode,
				this.originLayer,
				this.serviceName,
				JSON.stringify(unicoSerniorCandidate),
				JSON.stringify(this.responseApi)
			);

			this.responseApi.forEach((respRoute: object) => {
				this.returnResponse = respRoute;
			});

			loggerElastic(
				this.indexName,
				this.isCode,
				this.originLayer,
				this.serviceName,
				JSON.stringify(unicoSerniorCandidate),
				JSON.stringify(this.returnResponse)
			);

			return this.returnResponse;
		} catch (error) {
			loggerElastic(
				this.indexName,
				'499',
				this.originLayer,
				this.serviceName,
				JSON.stringify(unicoSerniorCandidate),
				JSON.stringify(error.message)
			);
		}
	}
}
