'use strict';

import {
	Service as MoleculerService,
	ServiceBroker,
	ServiceSchema
} from 'moleculer';
import { Event, Service } from 'moleculer-decorators';
import { StatusIntegrador } from '../../../../src/enum/integrador/enum';
import { IConfigLogCrmIso } from '../../../../src/interface/crmIso/config/configLog.interface';
import { IVPaymentCrmIso } from '../../../../src/interface/crmIso/payment/paymentCrmIso.interface';
import { IGetToken } from '../../../../src/interface/erpProtheus/global';
import {
	IOrderCheck,
	ISaveOrders
} from '../../../../src/interface/integration/order';
import { AxiosRequestType } from '../../../library/axios';
import {
	apmElasticConnect,
	loggerElastic
} from '../../../library/elasticSearch';
import { getTokenUrlGlobal } from '../../../library/erpProtheus';

@Service({
	name: 'service.crmiso-erpprotheus-payments',
	group: 'flow-cremmer'
})
export default class PaymentsCrmIsoService extends MoleculerService {
	public allPoolQueryCrmOrders: any;
	public indexName = 'flow-integration-routeorders';
	public serviceName = 'PaymentsCrmIsoService';
	public originLayer = 'erpProtheusViveo';

	public constructor(public broker: ServiceBroker, schema: ServiceSchema) {
		super(broker);
	}

	@Event({
		name: 'flow-crmiso-protheus-payments',
		group: 'flow-cremmer'
	})
	public async PoolQueryCrmPayments(ctxMessage: IVPaymentCrmIso) {
		this.logger.info(
			'================> RECEBENDO DADOS NO INTEGRADOR <================'
		);
		try {
			const token: IGetToken = await getTokenUrlGlobal(
				process.env.PROTHEUSVIVEO_BASEURL +
					process.env.PROTHEUSVIVEO_RESTCREMER +
					process.env.PROTHEUSVIVEO_URLTOKEN +
					process.env.PROTHEUSVIVEO_USER +
					process.env.PROTHEUSVIVEO_PASS
			);

			if (token.access_token) {
				const urlProtheusOrder =
					process.env.PROTHEUSVIVEO_BASEURL +
					process.env.PROTHEUSVIVEO_RESTCREMER +
					process.env.PROTHEUSVIVEO_URLORDER;

				apmElasticConnect.startTransaction(
					'flow-PutPayment',
					'request'
				);
				const responsePayemnt = await AxiosRequestType(
					urlProtheusOrder,
					ctxMessage.updatePayment,
					'put',
					{
						Authorization: 'Bearer ' + token.access_token,
						TenantID:
							ctxMessage.tenantId + ',' + ctxMessage.branchId
					}
				);
				apmElasticConnect.endTransaction(responsePayemnt);

				//Gera LOG na OrderChecks
				let valueOrderCheck: IOrderCheck = {
					tenantId: '11',
					orderId: ctxMessage.orderId,
					sourceCRM: 'ISOCRM',
					checkDescription: 'enviar_pagamento',
					seq: 4,
					topicName: this.serviceName,
					createdAt: new Date(),
					updatedAt: new Date(),
					sent: '1',
					success: '1',
					retryNumber: 0,
					nextTry: new Date(),
					commandSent: JSON.stringify(ctxMessage.updatePayment),
					url: urlProtheusOrder,
					method: 'PUT',
					body: JSON.stringify(ctxMessage.updatePayment, null, 2),
					responseCode: 200,
					response: '',
					validations_ok: 1
				};

				if (
					responsePayemnt.status == 200 ||
					responsePayemnt.status == 201
				) {
					valueOrderCheck.success = '1';
					valueOrderCheck.validations_ok = 1;
					valueOrderCheck.responseCode = responsePayemnt.status;
					valueOrderCheck.response = JSON.stringify(
						responsePayemnt.message
					);

					const updatePaymentStatus: ISaveOrders = {
						tenantId: ctxMessage.tenantId,
						orderId: ctxMessage.orderId,
						sourceCRM: 'ISOCRM',
						orderIdERP: ctxMessage.orderIdERP,
						status: StatusIntegrador.updatePayment
					};

					await this.broker.broadcast(
						'service-integration-updatedStatus',
						updatePaymentStatus
					);

					const logIso: IConfigLogCrmIso = {
						orderId: ctxMessage.orderId,
						name: StatusIntegrador.updatePayment,
						status: 'OK',
						description: `Pagamento de Cartão de Crédito Processado com Sucesso - FILIAL: ${ctxMessage.branchId} - OF: ${ctxMessage.orderIdERP} `,
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
				} else {
					valueOrderCheck.success = '0';
					valueOrderCheck.validations_ok = 0;
					valueOrderCheck.responseCode = 400;
					valueOrderCheck.response = JSON.stringify(responsePayemnt);

					const logIso: IConfigLogCrmIso = {
						orderId: ctxMessage.orderId,
						name: StatusIntegrador.retryPayment,
						status: 'FALHA',
						description: JSON.stringify(responsePayemnt),
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

				this.broker.broadcast(
					'service.integration.SaveOrderCheck',
					valueOrderCheck
				);

				loggerElastic(
					this.indexName,
					responsePayemnt.status.toString(),
					this.originLayer,
					this.serviceName,
					JSON.stringify(ctxMessage),
					JSON.stringify(responsePayemnt)
				);
			}
		} catch (error) {
			loggerElastic(
				this.indexName,
				'499',
				this.originLayer,
				this.serviceName,
				JSON.stringify(ctxMessage),
				JSON.stringify(error.message)
			);
			apmElasticConnect.captureError(new Error(error.message));
		}
	}
}
