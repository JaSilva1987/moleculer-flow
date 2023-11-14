'use strict';

import {
	Errors,
	Service as MoleculerService,
	ServiceBroker,
	ServiceSchema
} from 'moleculer';
import { Action, Service } from 'moleculer-decorators';
import * as dotenv from 'dotenv';
import { loggerElastic } from '../../library/elasticSearch';
import { httpPostGko } from '../../../src/controller/gko/services/postToGko.controller';

dotenv.config();
@Service({
	name: 'gko-post-request',
	group: 'flow-gko'
})
export default class postRequestToGko extends MoleculerService {
	public constructor(public broker: ServiceBroker, schema: ServiceSchema) {
		super(broker);
	}

	public indexName = 'flow-gko-post-request';
	public serviceName = 'post-request.service';
	public originLayer = 'gko';

	public async started() {}
	@Action({
		cache: false,
		rest: 'POST post-request/',
		name: 'service.gko.post-request',
		group: 'flow-gko'
	})
	public async PostToGko(context: any) {
		let xmlBody = context.params.body;
		loggerElastic(
			this.indexName,
			'200',
			this.originLayer,
			this.serviceName,
			String(xmlBody)
		);

		try {
			let responseRegister: string = await httpPostGko(xmlBody);
			console.log('RETORNO GKO', responseRegister);

			loggerElastic(
				this.indexName,
				'200',
				this.originLayer,
				this.serviceName,
				String(responseRegister)
			);
			context.meta.$responseHeaders = {
				'Content-Type': 'application/xml; charset=UTF-8'
			};

			return responseRegister;
		} catch (error) {
			loggerElastic(
				this.indexName,
				String(error.status),
				this.originLayer,
				this.serviceName,
				String(error.message)
			);
		}
	}
}
