'use strict';

import * as dotenv from 'dotenv';
import {
	Service as MoleculerService,
	ServiceBroker,
	ServiceSchema
} from 'moleculer';
import { Event, Service } from 'moleculer-decorators';
import ConsumerErpProtheusViveoController from '../../../src/controller/integration/consumer/consumer.controller';
import { connectionIntegrador } from '../../../src/data-source';
import { StatusIso } from '../../../src/enum/crmIso/enum';
import { StatusIntegrador } from '../../../src/enum/integration/enum';
import { IConfigLogCrmIso } from '../../../src/interface/crmIso/config/configLog.interface';
import { IMessageValidateConsumer } from '../../../src/interface/integration/consumer/messageConsumer.interface';
import { ISaveOrders } from '../../../src/interface/integration/order';
import { loggerElastic } from '../../library/elasticSearch';

dotenv.config();
@Service({
	name: 'consValidateConsumer',
	group: 'flow-cremmer'
})
export default class consValidateConsumer extends MoleculerService {
	public allOrders: Object;

	public constructor(public broker: ServiceBroker, schema: ServiceSchema) {
		super(broker);
	}

	public indexName = 'flow-crmiso-routeorders';
	public serviceName = 'consValidateConsumer.service';
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
			this.logger.error(error.message, 500);
		}
	}

	@Event({
		name: 'service.integration.consumer.consValidateConsumer',
		group: 'cremer'
	})
	public async ValidateConsumer(message: IMessageValidateConsumer) {
		try {
			this.logger.info('==============PROCESSA MENSAGEM==============');

			let status = 200;
			let request = JSON.stringify(message.message);
			const controllerConsumer = new ConsumerErpProtheusViveoController();
			const resValidaSuframa = await controllerConsumer.ValidaSuframa(
				message.message.ConsSuframa,
				message.message.Suframa,
				message.message.SituacaoSuframaHoje
			);

			const resValidacaoEspecial =
				await controllerConsumer.ValidacaoEspecial(
					message.message.StatusRegEspecial
				);

			const messageOrders: ISaveOrders = {
				tenantId: message.valueOrderCheck.tenantId,
				orderId: message.valueOrderCheck.orderId,
				sourceCRM: message.valueOrderCheck.sourceCRM,
				status: StatusIntegrador.consumerValid
			};

			if (resValidaSuframa == 1 && resValidacaoEspecial == 1) {
				status = 400;
				message.valueOrderCheck.validations_ok = 0;
				request = `0 -Suframa e Regime Especial nao validado - ConsSuframa: ${message.message.ConsSuframa} | Suframa: ${message.message.Suframa} | SituacaoSuframaHoje: ${message.message.SituacaoSuframaHoje}`;
				messageOrders.status =
					StatusIntegrador.errorProtheus + 'Cliente';
			} else if (resValidaSuframa == 1 && resValidacaoEspecial == 0) {
				status = 400;
				message.valueOrderCheck.validations_ok = 0;
				request = `1-Suframa não validado - ConsSuframa: ${message.message.ConsSuframa} | Suframa: ${message.message.Suframa} | SituacaoSuframaHoje: ${message.message.SituacaoSuframaHoje}`;
				messageOrders.status =
					StatusIntegrador.errorProtheus + 'Cliente';
			} else if (resValidaSuframa == 0 && resValidacaoEspecial == 1) {
				status = 400;
				message.valueOrderCheck.validations_ok = 0;
				request = `2-Regime especial nao validado (StatusRegEspecial: 'VENCIDO')`;
				messageOrders.status =
					StatusIntegrador.errorProtheus + 'Cliente';
			}

			this.broker.broadcast(
				'service-integration-updatedStatus',
				messageOrders
			);

			message.valueOrderCheck.responseCode = status;
			message.valueOrderCheck.response = request;

			this.broker.broadcast(
				'service.integration.SaveOrderCheck',
				message.valueOrderCheck
			);

			if (status == 400) {
				const updateIso = {
					cEmpresa: '11',
					cNumCRM: message.valueOrderCheck.orderId,
					enumStatusIso: StatusIso.seventeen
				};

				await this.broker.broadcast(
					'service-integration-updateSetIso',
					updateIso
				);

				const logIso: IConfigLogCrmIso = {
					orderId: message.valueOrderCheck.orderId,
					name: 'Erro Validação Cliente',
					status: 'FALHA',
					description: JSON.stringify(request),
					dateTimeSav: new Date(),
					dateTimeEvt: new Date(),
					branchId: null,
					orderIdERP: null,
					errorType: null,
					userViewer: null
				};

				const updateIsoStatus = {
					cEmpresa: messageOrders.tenantId,
					cNumCRM: messageOrders.orderId,
					enumStatusIso: StatusIso.seventeen
				};

				await this.broker.broadcast(
					'service-integration-updateSetIso',
					updateIsoStatus
				);

				await this.broker.broadcast(
					'service.crmIso.saveLogCrmIso',
					logIso
				);
			}

			loggerElastic(
				this.indexName,
				'200',
				this.originLayer,
				this.serviceName,
				JSON.stringify(request)
			);
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

	async stoped() {
		return await connectionIntegrador.destroy();
	}
}
