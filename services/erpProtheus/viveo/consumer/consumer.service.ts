'use strict';

import * as dotenv from 'dotenv';
import {
	Service as MoleculerService,
	ServiceBroker,
	ServiceSchema
} from 'moleculer';
import { Event, Service } from 'moleculer-decorators';
import { StatusIso } from '../../../../src/enum/crmIso/enum';
import { StatusIntegrador } from '../../../../src/enum/integration/enum';
import { IConfigLogCrmIso } from '../../../../src/interface/crmIso/config/configLog.interface';
import { ICustomerData } from '../../../../src/interface/erpProtheus/customer';
import { IMessageValidateConsumer } from '../../../../src/interface/integration/consumer/messageConsumer.interface';
import {
	IMessageConsumer,
	IOrderCheck,
	ISaveOrders
} from '../../../../src/interface/integration/order';
import { AxiosRequestType } from '../../../library/axios';
import { loggerElastic } from '../../../library/elasticSearch';
import {
	clearJson,
	getToken,
	getTokenUrlGlobal
} from '../../../library/erpProtheus';

dotenv.config();
@Service({
	name: 'consumerData',
	group: 'cremer'
})
export default class ConsumerErpProtheusViveo extends MoleculerService {
	public constructor(public broker: ServiceBroker, schema: ServiceSchema) {
		super(broker);
	}

	public indexName = 'flow-crmiso-routeorders';
	public serviceName = 'consumer.service';
	public originLayer = 'erpprotheusviveo';

	public async started() {}
	@Event({
		name: 'service.erpProtheusViveo.consumer.getConsumer',
		group: 'cremer'
	})
	public async GetConsumerData(message: IMessageConsumer) {
		try {
			this.logger.info('==============CONSUMER DATA==============');

			const token = await getTokenUrlGlobal(
				process.env.PROTHEUSVIVEO_BASEURL +
					process.env.PROTHEUSVIVEO_RESTCREMER +
					process.env.PROTHEUSVIVEO_URLTOKEN +
					process.env.PROTHEUSVIVEO_USER +
					process.env.PROTHEUSVIVEO_PASS
			);

			if (token.access_token) {
				const urlProtheusConsumer =
					process.env.PROTHEUSVIVEO_BASEURL +
					process.env.PROTHEUSVIVEO_RESTCREMER +
					process.env.PROTHEUSVIVEO_URLCONSUMER +
					"?Filter=CodigoCliente eq '" +
					message.codeClient +
					"' and Loja eq '" +
					message.codStore +
					"'";

				const responseConsumer = await AxiosRequestType(
					urlProtheusConsumer,
					'',
					'get',
					{
						Authorization: `Bearer ${token.access_token}`
					}
				);

				let commandSent: string;
				if (typeof responseConsumer.message == 'string') {
					commandSent = JSON.stringify(
						JSON.parse(
							responseConsumer.message
								.replace(/\t/g, '')
								.replace(/\n/g, '')
						).data.customer
					);
				} else {
					commandSent = JSON.stringify(
						responseConsumer.message.data.customer
					);
				}

				const valueOrderCheck: IOrderCheck = {
					tenantId: '11',
					orderId: message.orderId,
					sourceCRM: 'ISOCRM',
					checkDescription: 'dados_clientes',
					seq: 1,
					topicName: this.serviceName,
					createdAt: new Date(),
					updatedAt: new Date(),
					sent: '1',
					success: '1',
					retryNumber: 0,
					nextTry: new Date(),
					commandSent: commandSent,
					url: urlProtheusConsumer,
					method: 'GET',
					body: ' ',
					responseCode: 200,
					response: JSON.stringify(responseConsumer),
					validations_ok: 1
				};

				const messageOrders: ISaveOrders = {
					tenantId: '11',
					orderId: message.orderId,
					sourceCRM: 'ISOCRM',
					status: StatusIntegrador.productValid,
					updatedAt: new Date()
				};

				responseConsumer.status =
					String(responseConsumer.message).includes('ECONNREFUSED') ||
					String(responseConsumer.message).includes('ECONNRESET')
						? 500
						: responseConsumer.status;

				try {
					if (responseConsumer.status == 200) {
						const response: ICustomerData = await clearJson(
							commandSent
						);

						const msgValidade: IMessageValidateConsumer = {
							message: response,
							valueOrderCheck: valueOrderCheck
						};

						this.broker.broadcast(
							'service.integration.consumer.consValidateConsumer',
							msgValidade
						);
					} else {
						valueOrderCheck.responseCode = responseConsumer.status;
						valueOrderCheck.response =
							'Erro ao enviar dados do consumer';
						valueOrderCheck.validations_ok = 0;

						messageOrders.status =
							StatusIntegrador.errorProtheus + ' Cliente';

						const logIso: IConfigLogCrmIso = {
							orderId: message.orderId,
							name: 'Erro Validação Cliente',
							status: 'FALHA',
							description: JSON.stringify(
								responseConsumer.message
							),
							dateTimeSav: new Date(),
							dateTimeEvt: new Date(),
							branchId: null,
							orderIdERP: null,
							errorType: null,
							userViewer: null
						};

						await this.broker.broadcast(
							'service.crmIso.saveLogCrmIso',
							logIso
						);
					}
				} catch (error) {
					valueOrderCheck.responseCode = 400;
					valueOrderCheck.response =
						'Erro ao enviar dados do consumer';
					valueOrderCheck.validations_ok = 0;

					messageOrders.status =
						StatusIntegrador.errorProtheus + ' Cliente';

					loggerElastic(
						this.indexName,
						'499',
						this.originLayer,
						this.serviceName,
						JSON.stringify(message),
						JSON.stringify(error.message)
					);
				}

				this.broker.broadcast(
					'service-integration-updatedStatus',
					messageOrders
				);

				if (
					responseConsumer.status != 200 &&
					responseConsumer.status < 500
				) {
					const updateIso = {
						cEmpresa: '11',
						cNumCRM: message.orderId,
						enumStatusIso: StatusIso.seventeen
					};

					await this.broker.broadcast(
						'service-integration-updateSetIso',
						updateIso
					);

					const logIso: IConfigLogCrmIso = {
						orderId: message.orderId,
						name: 'Atualização status ISO',
						status: 'FALHA',
						description: 'Status ' + StatusIso.seventeen,
						dateTimeSav: new Date(),
						dateTimeEvt: new Date(),
						branchId: null,
						orderIdERP: null,
						errorType: null,
						userViewer: null
					};

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
					JSON.stringify(valueOrderCheck.response)
				);
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
