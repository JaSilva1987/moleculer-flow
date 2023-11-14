('use strict');

import { Service as MoleculerService, ServiceBroker } from 'moleculer';
import { Event, Service } from 'moleculer-decorators';
import DeliveryExpedLogBusinessRule from '../../../src/controller/expedlog/delivery/deliveryExpedLog.controller';
import { IScheduleDeliveryExpedLog } from '../../../src/interface/expedLog/deliveryExpedLog.interface';
import { IResponseExpedLog } from '../../../src/interface/expedLog/expedLog.interface';
import { apmElasticConnect, loggerElastic } from '../../library/elasticSearch';

@Service({
	name: 'expedlog.delivery',
	group: 'flow-expedlog'
})
export default class DeliveryExpedLogService extends MoleculerService {
	indexName = 'flow-expedlog';
	isCode = '200';
	errCode = '499';
	originLayer = 'delivery';
	serviceNamePost = 'DeliveryExpedLogServicePost';
	serviceNameGet = 'DeliveryExpedLogServiceGet';
	serviceNameSchedule = 'DeliveryExpedLogServiceSchedule';
	responseReturn: any | IResponseExpedLog;
	requestReturn: any | IResponseExpedLog;

	public constructor(public broker: ServiceBroker) {
		super(broker);
	}

	@Event({
		name: 'expedlog.delivery-schedule.post',
		group: 'flow-expedlog'
	})
	public async ExpedLogPost(expedLogMessage: IScheduleDeliveryExpedLog) {
		try {
			const expedLogController = new DeliveryExpedLogBusinessRule();
			this.responseReturn = await expedLogController.DeliveryExpedLogPost(
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
