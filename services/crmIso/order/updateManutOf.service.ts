'use strict';

import {
	Service as MoleculerService,
	ServiceBroker,
	ServiceSchema
} from 'moleculer';
import { Event, Service } from 'moleculer-decorators';
import { ManutOfsController } from '../../../src/controller/crmIso/order/manutOf.controller';
import { IProcessManutOf } from '../../../src/interface/crmIso/orderFat/updateManutOf.interface';
import { loggerElastic } from '../../library/elasticSearch';

@Service({
	name: 'updateManutOf',
	group: 'flow-cremmer'
})
export default class updateManutOf extends MoleculerService {
	public indexName = 'flow-integration-routeorders';
	public serviceName = 'updateManutOf.service';
	public originLayer = 'crmIso';
	public statusElastic = '200';

	public constructor(public broker: ServiceBroker, schema: ServiceSchema) {
		super(broker);
	}

	@Event({
		name: 'service.crmIso.orderFat.updateManutOf',
		group: 'cremer'
	})
	public async updateManutOf(ctxMessage: IProcessManutOf) {
		try {
			const setController = new ManutOfsController(
				this.broker,
				this.schema
			);
			const updateManut = await setController.updateManutOf(ctxMessage);

			loggerElastic(
				this.indexName,
				this.statusElastic,
				this.originLayer,
				this.serviceName,
				JSON.stringify(ctxMessage),
				JSON.stringify([updateManut])
			);
		} catch (error) {
			loggerElastic(
				this.indexName,
				'499',
				this.originLayer,
				this.serviceName,
				JSON.stringify(ctxMessage),
				JSON.stringify(error.message)
			);
		}
	}
}
