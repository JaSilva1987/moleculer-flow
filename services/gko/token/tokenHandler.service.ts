'use strict';

import {
	Service as MoleculerService,
	ServiceBroker,
	ServiceSchema
} from 'moleculer';
import { Action, Service } from 'moleculer-decorators';
import * as dotenv from 'dotenv';
import { getToken } from '../../library/gko';
import { loggerElastic } from '../../library/elasticSearch';
import { ValidTokenRepository } from '../../../src/repository/integration/token/token.repository';

dotenv.config();
@Service({
	name: 'gko-token',
	group: 'flow-gko'
})
export default class tokenHandlerGko extends MoleculerService {
	public constructor(public broker: ServiceBroker, schema: ServiceSchema) {
		super(broker);
	}

	public indexName = 'flow-gko-token';
	public serviceName = 'token-handler.service';
	public originLayer = 'gko';

	public async started() {}
	@Action({
		cache: false,
		rest: 'POST token/',
		name: 'service.gko.token',
		group: 'flow-gko'
	})
	public async RetriveGkoToken(context: any) {
		let tokenResponse = await ValidTokenRepository.GetValidToken('gko');

		return tokenResponse;
	}
}
