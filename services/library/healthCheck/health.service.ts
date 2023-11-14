'use strict';
import { Service, ServiceBroker } from 'moleculer';
import { healthCheck } from '../../../src/interface/library/healthcheck/healthcheck.interface';

export default class HealthCheckService extends Service {
	responseHealth: healthCheck;
	public constructor(public broker: ServiceBroker) {
		super(broker);
		this.parseServiceSchema({
			cache: false,
			name: 'healthcheck',
			group: 'flow',
			actions: {
				hello: {
					rest: {
						method: 'GET',
						path: '/'
					},
					async handler(): Promise<string> {
						return await this.HealtCheck();
					}
				}
			}
		});
	}

	// Action
	public async HealtCheck() {
		const healtStatus = await this.broker.getLocalNodeInfo();

		if (healtStatus.services.length > 0) {
			this.responseHealth = {
				code: 200,
				message: 'API On Air'
			};
		} else {
			this.responseHealth = {
				code: 500,
				message: 'Out of Air API'
			};
		}

		return this.responseHealth;
	}
}
