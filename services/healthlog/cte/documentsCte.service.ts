('use strict');

import { Service as MoleculerService, ServiceBroker } from 'moleculer';
import { Event, Service } from 'moleculer-decorators';
import DocumentsCteBusinessRule from '../../../src/controller/cte/documents/documentsCte.controller';
import {
	IDocumentsCteReturn,
	ISendWebHook
} from '../../../src/interface/cte/documents/documentsCte.interface';
import { apmElasticConnect, loggerElastic } from '../../library/elasticSearch';

@Service({
	name: 'cte.heathlog.jarilog',
	group: 'flow-cte'
})
export default class DocumentsCteService extends MoleculerService {
	indexName = 'flow-cte';
	isCode = '200';
	errCode = '499';
	originLayer = 'healthlog';
	serviceNamePost = 'DocumentsCteServiceSchedule';
	responseReturn: any | IDocumentsCteReturn;

	public constructor(public broker: ServiceBroker) {
		super(broker);
	}

	@Event({
		name: 'cte.healthlog.schedule',
		group: 'flow-cte'
	})
	public async CteSchedule(cteMessage: ISendWebHook) {
		try {
			const cteController = new DocumentsCteBusinessRule();
			const validRule = await cteController.ValidSchedule(cteMessage);

			loggerElastic(
				this.indexName,
				this.isCode,
				this.originLayer,
				this.serviceNameGet,
				JSON.stringify(cteMessage),
				JSON.stringify(validRule)
			);
		} catch (error) {
			loggerElastic(
				this.indexName,
				this.errCode,
				this.originLayer,
				this.serviceNameGet,
				JSON.stringify(cteMessage),
				JSON.stringify(error.message)
			);
			apmElasticConnect.captureError(new Error(error.message));
		}
	}
}
