'use strict';

import {
	Service as MoleculerService,
	ServiceBroker,
	ServiceSchema
} from 'moleculer';
import { Event, Service } from 'moleculer-decorators';
import { IUpdateOrders } from '../../../src/interface/crmIso/order/updateOrder.interface';
import { UpdateOrdersRepository } from '../../../src/repository/crmIso/order/updateCrmIsoOrder.repository';
import { loggerElastic } from '../../library/elasticSearch';

@Service({
	name: 'service.crmiso.order.updateOrderStatus',
	group: 'flow-cremmer'
})
export default class OrdersService extends MoleculerService {
	public indexName = 'flow-integration-routeorders';
	public serviceName = 'saveOrders.service';
	public originLayer = 'integration';
	public statusElastic: '200';

	public constructor(public broker: ServiceBroker, schema: ServiceSchema) {
		super(broker);
	}

	@Event({
		name: 'service-crmiso-order-updateCrmIsoStatus',
		group: 'flow-cremmer'
	})
	public async UpdateOrderStatus(message: IUpdateOrders) {
		try {
			await UpdateOrdersRepository.UpdateCrmIsoOrders(message);

			loggerElastic(
				this.indexName,
				'200',
				this.originLayer,
				this.serviceName,
				JSON.stringify(message)
			);
		} catch (error) {
			loggerElastic(
				this.indexName,
				'499',
				this.originLayer,
				this.serviceName,
				JSON.stringify(error)
			);
		}
	}
}
