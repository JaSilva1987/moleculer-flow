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
import { IRequestPfs } from '../../../src/interface/sap/request/requestPfs/interface';
import { loggerElastic } from '../../library/elasticSearch';

dotenv.config();
@Service({
	name: 'sap.pfs.request',
	group: 'flow-pfs'
})
export default class RequestPfs extends MoleculerService {
	public constructor(public broker: ServiceBroker, schema: ServiceSchema) {
		super(broker);
	}

	public indexName = 'flow-pfs-request';
	public serviceName = 'requestPfs.service';
	public originLayer = 'sap';

	@Action({
		cache: false,
		rest: 'POST /',
		name: 'service.sap.requestpfs.sendRequestPfs',
		group: 'flow-pfs'
	})
	public async postRequestPfs(context: Context<IRequestPfs>) {
		const v = new Validator();
		const schema = {
			tipo_pedido: { type: 'string', min: 1, max: 1 },
			num_pedido: { type: 'string', min: 1, max: 30 },
			cliente: { type: 'string', min: 1, max: 18 },
			mensagem_nota: { type: 'string', min: 3, max: 255 },
			nat_operacao: { type: 'number', integer: true },
			items: {
				type: 'array',
				items: {
					type: 'object',
					props: {
						produto: { type: 'string', min: 1, max: 20 },
						quantidade: {
							type: 'number',
							positive: true,
							integer: true
						},
						preco_unitario: { type: 'number', positive: true }
					}
				}
			}
		};

		const check = v.compile(schema);
		const validator = check(context.params);

		if (validator == true) {
			const sendRequest: IRequestPfs = { ...context.params };

			loggerElastic(
				this.indexName,
				'200',
				this.originLayer,
				this.serviceName,
				`POST flow/sap/pfs/request`,
				JSON.stringify(sendRequest)
			);

			const responseReturn: any = await this.broker.broadcast(
				'pfs.integration.save.request',
				sendRequest
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
				`POST flow/sap/pfs/request`,
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
