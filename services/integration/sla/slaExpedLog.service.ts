('use strict');

import { Service as MoleculerService, ServiceBroker } from 'moleculer';
import { Event, Service } from 'moleculer-decorators';

import SLAExpedLogBusinessRule from '../../../src/controller/expedlog/sla/slaExpedLog.controller';
import { IResponseExpedLog } from '../../../src/interface/expedLog/expedLog.interface';
import {
	ISLARecalculationExpedLog,
	ISLASearchTableExpedLog
} from '../../../src/interface/expedLog/slaExpedLog.interface';
import { apmElasticConnect, loggerElastic } from '../../library/elasticSearch';

@Service({
	name: 'expedlog.sla',
	group: 'flow-expedlog'
})
export default class SLAExpedLogService extends MoleculerService {
	indexName = 'flow-expedlog';
	isCode = '200';
	errCode = '499';
	originLayer = 'sla';
	serviceNamePost = 'SLAExpedLogServicePost';
	serviceNameGet = 'SLAExpedLogServiceGet';
	serviceNameSchedule = 'SLAExpedLogServiceSchedule';
	responseReturn: any | IResponseExpedLog;
	requestReturn: any | IResponseExpedLog;

	public constructor(public broker: ServiceBroker) {
		super(broker);
	}

	@Event({
		name: 'expedlog.sla-recalculation.post',
		group: 'flow-expedlog'
	})
	public async SLARecalculationExpedLogPost(
		expedLogMessage: ISLARecalculationExpedLog
	) {
		try {
			const expedLogController = new SLAExpedLogBusinessRule();
			this.responseReturn =
				await expedLogController.SLARecalculationExpedLogPost(
					expedLogMessage
				);

			loggerElastic(
				this.indexName,
				this.isCode,
				this.originLayer,
				this.serviceNamePost,
				JSON.stringify(expedLogMessage),
				JSON.stringify(this.responseReturn)
			);

			return this.responseReturn;
		} catch (error) {
			loggerElastic(
				this.indexName,
				this.errCode,
				this.originLayer,
				this.serviceNamePost,
				JSON.stringify(expedLogMessage),
				JSON.stringify(error.message)
			);
			apmElasticConnect.captureError(new Error(error.message));
		}
	}

	@Event({
		name: 'expedlog.sla-search-table.post',
		group: 'flow-expedlog'
	})
	public async SLASearchTableExpedLogPost(
		expedLogMessage: ISLASearchTableExpedLog
	) {
		try {
			const expedLogController = new SLAExpedLogBusinessRule();
			this.responseReturn =
				await expedLogController.SLASearchTableExpedLogPost(
					expedLogMessage
				);

			loggerElastic(
				this.indexName,
				this.isCode,
				this.originLayer,
				this.serviceNamePost,
				JSON.stringify(expedLogMessage),
				JSON.stringify(this.responseReturn)
			);

			return this.responseReturn;
		} catch (error) {
			loggerElastic(
				this.indexName,
				this.errCode,
				this.originLayer,
				this.serviceNamePost,
				JSON.stringify(expedLogMessage),
				JSON.stringify(error.message)
			);
			apmElasticConnect.captureError(new Error(error.message));
		}
	}
}
