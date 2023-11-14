'use strict';

import {
	Service as MoleculerService,
	ServiceBroker,
	ServiceSchema
} from 'moleculer';
import { Event, Service } from 'moleculer-decorators';
import { IConfigLogCrmIso } from '../../../src/interface/crmIso/config/configLog.interface';
import { ConfigLogRepository } from '../../../src/repository/crmIso/config/configLog.repository';
import { loggerElastic } from '../../library/elasticSearch';

@Service({
	name: 'configLogCrmIso',
	group: 'flow-cremmer'
})
export default class ConfigLogIsoCrm extends MoleculerService {
	public constructor(public broker: ServiceBroker, schema: ServiceSchema) {
		super(broker);
	}

	@Event({
		name: 'service.crmIso.saveLogCrmIso',
		group: 'flow-cremmer'
	})
	public async PostSaveLogCrmIso(message: IConfigLogCrmIso) {
		this.logger.info('==============GRAVA DADOS DO LOG ==============');

		try {
			const isGet = await ConfigLogRepository.GetLog(message);

			if (isGet == undefined || isGet == null) {
				return await ConfigLogRepository.PostLog(message);
			} else {
				console.log('ORDER DUPLICADA: ' + message.orderId);
			}
		} catch (error) {
			this.logger.error(
				`ERRO AO GRAVAR LOG DO REGISTRO ${JSON.stringify(
					error.message
				)}`
			);

			await loggerElastic(
				this.indexName,
				'499',
				this.originLayer,
				this.serviceName,
				`ERRO AO GRAVAR LOG DO REGISTRO ${message}`,
				`ERRO AO GRAVAR LOG DO REGISTRO ${JSON.stringify(
					error.message
				)}`
			);
		}
	}
}
