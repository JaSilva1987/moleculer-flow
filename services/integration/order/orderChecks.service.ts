'use strict';

import * as dotenv from 'dotenv';
import {
	Service as MoleculerService,
	ServiceBroker,
	ServiceSchema
} from 'moleculer';
import { Event, Service } from 'moleculer-decorators';
import { connectionIntegrador } from '../../../src/data-source';
import { IOrderCheck } from '../../../src/interface/integration/order';
import { OrderCheckRepository } from '../../../src/repository/integration/order/orderCheck.repository';
import { loggerElastic } from '../../library/elasticSearch';

dotenv.config();
@Service({
	name: 'service.integration.orderCheck',
	group: 'flow-cremmer-integration-order'
})
export default class orderCheckService extends MoleculerService {
	public allOrders: Object;

	public constructor(public broker: ServiceBroker, schema: ServiceSchema) {
		super(broker);
	}

	public indexName = 'flow-crmiso-routeorders';
	public originLayer = 'crmiso';

	async started() {
		try {
			await connectionIntegrador.initialize();
		} catch (error) {
			loggerElastic(
				this.indexName,
				'500',
				this.originLayer,
				this.serviceName,
				'',
				JSON.stringify(error.message)
			);
			this.logger.error(error.message, 500);
		}
	}

	@Event({
		name: 'service.integration.SaveOrderCheck',
		group: 'cremer-integration-order'
	})
	public async SaveOrderCheck(message: IOrderCheck) {
		this.logger.info(
			'==============GRAVA DADOS NA ORDER CHECKS=============='
		);

		try {
			const validationsOrderCheck =
				await OrderCheckRepository.GetOrderCheckByPrimaryColumns(
					message.tenantId,
					message.orderId,
					message.sourceCRM,
					message.checkDescription
				);

			if (validationsOrderCheck.length == 0) {
				const response = await OrderCheckRepository.PostOrderCheck(
					message
				);

				loggerElastic(
					this.indexName,
					'200',
					this.originLayer,
					'PostOrderCheck.repository',
					JSON.stringify(response)
				);
			} else {
				const response = await OrderCheckRepository.PutOrderCheck(
					message
				);

				loggerElastic(
					this.indexName,
					'200',
					this.originLayer,
					'PutOrderCheck.repository',
					JSON.stringify(response)
				);
			}
		} catch (error) {
			loggerElastic(
				this.indexName,
				'499',
				this.originLayer,
				'postOrdersCheck.repository',
				JSON.stringify(error.message)
			);
		}
	}

	async stoped() {
		return await connectionIntegrador.destroy();
	}
}
