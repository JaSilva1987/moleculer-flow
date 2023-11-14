'use strict';

import * as dotenv from 'dotenv';
import {
	Errors,
	Service as MoleculerService,
	ServiceBroker,
	ServiceSchema
} from 'moleculer';
import { Event, Service } from 'moleculer-decorators';
import moment from 'moment';
import { connectionIntegrador } from '../../../src/data-source';
import { StatusIso } from '../../../src/enum/crmIso/enum';
import { StatusIntegrador } from '../../../src/enum/integration/enum';
import { IConfigLogCrmIso } from '../../../src/interface/crmIso/config/configLog.interface';
import { ISaveOrders } from '../../../src/interface/integration/order';
import { IMessageValidateUnitProduct } from '../../../src/interface/integration/product/messageUnitProduct.interface';
import { loggerElastic } from '../../library/elasticSearch';

dotenv.config();
@Service({
	name: 'consValidateUnitProduct',
	group: 'flow-cremmer'
})
export default class consValidateUnitProduct extends MoleculerService {
	public allOrders: Object;

	public constructor(public broker: ServiceBroker, schema: ServiceSchema) {
		super(broker);
	}

	public indexName = 'flow-crmiso-routeorders';
	public serviceName = 'consValidateUnitProduct.service';
	public originLayer = 'integration';

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
			throw new Errors.MoleculerRetryableError(error.message, 500);
		}
	}

	@Event({
		name: 'service.integration.product.consValidateUnitProduct',
		group: 'cremer'
	})
	public async ValidateIUnitProduct(message: IMessageValidateUnitProduct) {
		let status = 200;
		let request = '';

		this.logger.info(
			'============== CONSVALIDATEUNITPRODUCT =============='
		);
		const messageOrders: ISaveOrders = {
			tenantId: message.valueOrderCheck.tenantId,
			orderId: message.valueOrderCheck.orderId,
			sourceCRM: message.valueOrderCheck.sourceCRM,
			status:
				message.message.OF.status == 'ERRO'
					? StatusIntegrador.errorProtheus + ' Produto'
					: StatusIntegrador.productValid,
			updatedAt: new Date()
		};

		if (!message.message.OF.dtFaturamento) {
			message.valueOrderCheck.validations_ok = 0;
			status = 400;
			request = `0 - Data de Faturamento não encontrado no retorno do PROTHEUS`;
			messageOrders.status = StatusIntegrador.errorProtheus + 'Produto';
			message.valueOrderCheck.response = request;
		} else if (
			!moment(
				message.message.OF.dtFaturamento,
				'YYYY-MM-DD',
				true
			).isValid()
		) {
			message.valueOrderCheck.validations_ok = 0;
			status = 400;
			request = `1 - Data inválida)`;
			messageOrders.status = StatusIntegrador.errorProtheus + 'Produto';
			message.valueOrderCheck.response = request;
		} else if (message.message.OF.status == 'ERRO') {
			status = 400;
			request = `2 - ${message.message.OF.mensagemFinal}`;
			messageOrders.status = StatusIntegrador.errorProtheus + 'Produto';
			message.valueOrderCheck.validations_ok = 0;
			message.valueOrderCheck.response = request;
		}

		///==============Grava ORDERS==============
		this.broker.broadcast(
			'service-integration-updatedStatus',
			messageOrders
		);

		//==============Grava ORDER CHECKS==============
		this.broker.broadcast(
			'service.integration.SaveOrderCheck',
			message.valueOrderCheck
		);

		if (status == 400) {
			const updateIso = {
				cEmpresa: message.valueOrderCheck.tenantId,
				cNumCRM: message.valueOrderCheck.orderId,
				enumStatusIso: StatusIso.seventeen
			};

			await this.broker.broadcast(
				'service-integration-updateSetIso',
				updateIso
			);

			const logIso: IConfigLogCrmIso = {
				orderId: message.valueOrderCheck.orderId,
				name: 'error validacao_produto',
				status: 'FALHA',
				description: 'Status ' + StatusIso.seventeen + ' - ' + request,
				dateTimeSav: new Date(),
				dateTimeEvt: new Date(),
				branchId: null,
				orderIdERP: null,
				errorType: null,
				userViewer: null
			};

			await this.broker.broadcast('service.crmIso.saveLogCrmIso', logIso);
		}

		loggerElastic(
			this.indexName,
			status.toString(),
			this.originLayer,
			this.serviceName,
			JSON.stringify(request)
		);
	}

	async stoped() {
		return await connectionIntegrador.destroy();
	}
}
