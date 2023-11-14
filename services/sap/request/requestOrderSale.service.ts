'use strict';

import * as dotenv from 'dotenv';
import Validator from 'fastest-validator';
import {
	Context,
	Errors,
	Service as MoleculerService,
	ServiceBroker,
	ServiceSchema
} from 'moleculer';
import { Action, Service } from 'moleculer-decorators';
import { IRequestSalePfs } from '../../../src/interface/sap/request/requestOrderSalePfs.interface';
import { requestOrderSaleSchema } from '../../../src/validator/sap/requests/requestOrderSale.validator';
import { loggerElastic } from '../../library/elasticSearch';

dotenv.config();
@Service({
	name: 'sap.pfs.requestOrderSale',
	group: 'flow-pfs'
})
export default class RequestOrderSalePfs extends MoleculerService {
	public constructor(public broker: ServiceBroker, schema: ServiceSchema) {
		super(broker);
	}

	public indexName = 'flow-pfs-requestordersale';
	public serviceName = 'requestOrderSalePfs.service';
	public originLayer = 'flow-sap';

	@Action({
		cache: false,
		rest: 'POST /',
		name: 'service.sap.requestpfs.sendRequestOrderSalePfs',
		group: 'flow-pfs'
	})
	public async postRequestOrderSalePfs(context: Context<IRequestSalePfs>) {
		const validatorSchema = new Validator();

		const check = validatorSchema.compile(requestOrderSaleSchema);
		const validator = check(context.params);

		if (validator == true) {
			const sendRequestOrderSale: IRequestSalePfs = { ...context.params };

			loggerElastic(
				this.indexName,
				'200',
				this.originLayer,
				this.serviceName,
				`POST flow/sap/pfs/requestOrderSale`,
				JSON.stringify(sendRequestOrderSale)
			);

			const responseReturn: any = await this.broker.broadcast(
				'pfs.integration.save.requesteOrderSale',
				sendRequestOrderSale
			);

			const msgReturn = responseReturn[0][0][0][0];

			return {
				status:
					msgReturn.status == 201
						? msgReturn.status
						: msgReturn.status + ' - ERRO PROTHEUS',
				message: msgReturn.message
			};
		} else {
			loggerElastic(
				this.indexName,
				'400',
				this.originLayer,
				this.serviceName,
				`POST flow/sap/pfs/requestOrderSale`,
				JSON.stringify(validator)
			);

			throw new Errors.MoleculerError(
				'Campos Obrigatórios não preenchidos',
				400,
				'VALIDATION_ERROR',
				validator
			);
		}
	}
}
