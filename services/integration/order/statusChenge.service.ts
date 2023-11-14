'use strict';

import { format, sub } from 'date-fns';
import {
	Service as MoleculerService,
	ServiceBroker,
	ServiceSchema
} from 'moleculer';
import { Event, Service } from 'moleculer-decorators';
import { StatusIntegrador } from '../../../src/enum/integration/enum';
import { SaveOrdersCrmIsoRepository } from '../../../src/repository/integration/order/orders.repository';
import { loggerElastic } from '../../library/elasticSearch';
@Service({
	name: 'service.integration.order.statusChange',
	group: 'flow-cremmer'
})
export default class StatusChangeService extends MoleculerService {
	public checkInitial: any;
	public sendMessage: Object;

	public constructor(public broker: ServiceBroker, schema: ServiceSchema) {
		super(broker);
	}

	@Event({
		name: 'service-integration-order-statusChange',
		group: 'flow-cremmer'
	})
	public async StatusChangeOrder(ctx: any) {
		const getLastUpdated = format(
			sub(new Date(), { minutes: 2 }),
			'yyyy-MM-dd HH:mm:ss.000'
		);

		try {
			if (Boolean(ctx.params) == true) {
				const generateOrder =
					await SaveOrdersCrmIsoRepository.GetStatusByUpdated(
						StatusIntegrador.generateOrder,
						getLastUpdated
					);
				if (generateOrder.length > 0) {
					for (const ordem of generateOrder) {
						this.sendMessage = {
							cNumCRM: ordem.orderId
						};

						setTimeout(async () => {
							await this.broker.broadcast(
								'service-erpProtheus-order-statusChange',
								this.sendMessage
							);
						}, 2000);
					}
				}
			}
		} catch (error) {
			loggerElastic(
				this.indexName,
				'499',
				this.originLayer,
				this.serviceName,
				'',
				JSON.stringify(error.message)
			);
		}
	}
}
