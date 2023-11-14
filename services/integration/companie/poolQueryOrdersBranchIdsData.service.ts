'use strict';

import { CronJob } from 'cron';
import {
	Service as MoleculerService,
	ServiceBroker,
	ServiceSchema
} from 'moleculer';
import { Event, Service } from 'moleculer-decorators';
import {
	IArrayOrdersBranchIds,
	IOrdersBranchIds
} from '../../../src/interface/integration/companies/ordersBranchIdData.interface';
import { ordersBranchIdsDataRepository } from '../../../src/repository/integration/companie/ordersBranchIdsData.repository';
import { loggerElastic } from '../../library/elasticSearch';

@Service({
	name: 'service.integration.companie.poolQueryOrdersBranchIdsData',
	group: 'flow-cremmer'
})
export default class OrdersBranchIdsData extends MoleculerService {
	public indexName = 'flow-integration-routeorders';
	public serviceName = 'poolqueryordersbranchidsdata';
	public originLayer = 'integration';

	public constructor(public broker: ServiceBroker, schema: ServiceSchema) {
		super(broker);

		const CronJobExecute = new CronJob('0 */3 * * * *', async () => {
			try {
				this.broker.broadcast(
					'service.integraton.order.poolQueryOrdersBranchIds',
					process.env.FLOW_CREMER_ATIVE
				);
			} catch {
				new Error('Cron not run');
			}
		});

		if (!CronJobExecute.running) CronJobExecute.start();
	}

	@Event({
		name: 'service.integraton.order.poolQueryOrdersBranchIds',
		group: 'flow-cremmer'
	})
	public async poolQueryOrdersBranchIds(ctx: any) {
		try {
			if (ctx.params == 'true') {
				this.logger.info(
					'==============POOLQUERYORDERBRANCHIDS=============='
				);
				const dataPoolQueryOrdersBranchIds =
					await ordersBranchIdsDataRepository.GetAll();

				if (dataPoolQueryOrdersBranchIds.length > 0) {
					for (const result of dataPoolQueryOrdersBranchIds) {
						let params: IOrdersBranchIds = {
							tenantId: result.tenantId,
							branchId: result.branchId,
							sourceCRM: result.sourceCRM,
							data: result.data,
							hora: result.hora
						};

						const poolOrdersBranch: IArrayOrdersBranchIds = {
							orders: params
						};

						await this.broker.broadcast(
							'service.erpProtheus.order.getLogOrdersDataERP',
							poolOrdersBranch
						);
					}
				}
			}
		} catch (error) {
			loggerElastic(
				this.indexName,
				'499',
				this.originLayer,
				this.serviceName,
				JSON.stringify(error.message)
			);
		}
	}
}
