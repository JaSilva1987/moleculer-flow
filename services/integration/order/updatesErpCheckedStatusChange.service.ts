'use strict';

import {
	Errors,
	Service as MoleculerService,
	ServiceBroker,
	ServiceSchema
} from 'moleculer';
import { Event, Method, Service } from 'moleculer-decorators';
import { connectionIntegrador } from '../../../src/data-source';
import { IOrderStatusChenge } from '../../../src/interface/integration/order/orderStatusChenge.interface';
import { OrdersErpCheckedStatusChangeRepository } from '../../../src/repository/integration/order/ordersErpCheckedStatusChange.repository';
import { loggerElastic } from '../../library/elasticSearch';

@Service({
	name: 'service.integration.order.updatesErpCheckedStatusChange',
	group: 'flow-cremmer'
})
export default class updatesErpCheckedStatusCRM extends MoleculerService {
	public indexName = 'flow-integration-routeorders';
	public serviceName = 'updatesErpCheckedStatusChange.service';
	public originLayer = 'integration/order';
	public insertOrderStatusChange: Object;
	public statusElastic: '200';

	public constructor(public broker: ServiceBroker, schema: ServiceSchema) {
		super(broker);
	}

	async started() {
		try {
			await [connectionIntegrador.initialize()];
		} catch (error) {
			loggerElastic(
				this.indexName,
				'500',
				this.originLayer,
				this.serviceName,
				'service.integration.order.updatesErpCheckedStatusChange',
				JSON.stringify(error.message)
			);
			this.logger.error(error.message, 500);
		}
	}

	@Event({
		name: 'service.integration.order.updatesErpChecked',
		group: 'flow-cremmer'
	})
	public async updatesErpChecked(ctx: any) {
		try {
			await this.integrationErpCheckedStatusChange(ctx.params);
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

	@Method
	public async integrationErpCheckedStatusChange(
		message: IOrderStatusChenge
	) {
		try {
			this.logger.info(
				'======= INICIO INSERÇÃO LOG STATUS ORDERS INTEGRATION ======='
			);
			this.insertOrderStatusChange =
				await OrdersErpCheckedStatusChangeRepository.PostErpCheckedStatusChange(
					message
				);
		} catch (error) {
			loggerElastic(
				this.indexName,
				'499',
				this.originLayer,
				this.serviceName,
				JSON.stringify(message),
				JSON.stringify(error.message)
			);
		}
	}

	async stoped() {
		return await connectionIntegrador.destroy();
	}
}
