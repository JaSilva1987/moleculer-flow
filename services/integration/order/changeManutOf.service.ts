import {
	Service as MoleculerService,
	ServiceBroker,
	ServiceSchema
} from 'moleculer';
import { Event, Service } from 'moleculer-decorators';
import { IConfigLogCrmIso } from '../../../src/interface/crmIso/config/configLog.interface';
import { IPoolCheckChangedOf } from '../../../src/interface/crmIso/order/poolCheckChangeOf.interface';
import { IProcessManutOf } from '../../../src/interface/crmIso/orderFat/updateManutOf.interface';
import { IntegradorManutOfRepository } from '../../../src/repository/integration/order/manutOf.repository';
import { loggerElastic } from '../../library/elasticSearch';

@Service({
	name: 'changeManutOfIsoCrm',
	group: 'flow-cremmer'
})
export default class ChangeManutOfServices extends MoleculerService {
	public indexName = 'flow-crmiso-manutof';
	public serviceName = 'changeManutOfIsoCrm.service';
	public originLayer = 'integration';
	responseApi: any | object;
	returnBox: Array<object>;

	public constructor(public broker: ServiceBroker, schema: ServiceSchema) {
		super(broker);
	}

	@Event({
		name: 'service.integration.order.updateOrderField',
		group: 'flow-cremmer'
	})
	public async updateOrderField(ctxMessage: IPoolCheckChangedOf) {
		try {
			await this.broker.emit(
				'service.erpProtheus.order.updateOrderField',
				ctxMessage
			);

			loggerElastic(
				this.indexName,
				'200',
				this.originLayer,
				this.serviceName,
				JSON.stringify(ctxMessage),
				''
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
			this.logger.error(error.message, 499);
		}
	}

	@Event({
		name: 'service.integration.order.updateOrderFieldSaveLogs',
		group: 'flow-cremmer'
	})
	public async updateOrderFieldSaveLogs(ctxMessage: IConfigLogCrmIso) {
		try {
			await this.broker.emit('service.crmIso.saveLogCrmIso', ctxMessage);

			loggerElastic(
				this.indexName,
				'200',
				this.originLayer,
				this.serviceName,
				JSON.stringify(ctxMessage),
				''
			);

			return this.returnBox;
		} catch (error) {
			loggerElastic(
				this.indexName,
				'499',
				this.originLayer,
				this.serviceName,
				JSON.stringify(ctxMessage),
				JSON.stringify(error.message)
			);
			this.logger.error(error.message, 499);
		}
	}

	@Event({
		name: 'service.integration.orderFat.updateManutOf',
		group: 'flow-cremmer'
	})
	public async updateOrderProcess(ctxMessage: IProcessManutOf) {
		try {
			const saveOrder = await IntegradorManutOfRepository.PostManutOf(
				ctxMessage
			);

			loggerElastic(
				this.indexName,
				'200',
				this.originLayer,
				this.serviceName,
				JSON.stringify(ctxMessage),
				JSON.stringify(saveOrder)
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
			this.logger.error(error.message, 499);
		}
	}
}
