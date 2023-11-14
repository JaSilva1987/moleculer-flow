'use strict';

import {
	Service as MoleculerService,
	ServiceBroker,
	ServiceSchema
} from 'moleculer';
import { Event, Service } from 'moleculer-decorators';
import { StatusIso } from '../../../../src/enum/crmIso/enum';
import { IUpdateOrders } from '../../../../src/interface/crmIso/order/updateOrder.interface';
import { IGetToken } from '../../../../src/interface/erpProtheus/global';
import { IStatusOrderChenge } from '../../../../src/interface/erpProtheus/order/statusChangeOrder.interface';
import { AxiosRequestType } from '../../../library/axios';
import { loggerElastic } from '../../../library/elasticSearch';
import { getToken } from '../../../library/erpProtheus';

@Service({
	name: 'service.erpProtheus.order.statusChange',
	group: 'flow-cremmer'
})
export default class StatusChangeService extends MoleculerService {
	public checkInitial: any;
	public sendMessage: Object;
	public companieSubsidy: string;
	public setStatusErp: string;
	public setStatus: any;
	public ordersStatusChanged: object;
	public tipoCancelamento: string;
	public grauParentesco: string;
	public updateIntegrator: object;
	public indexName = 'flow-erpprotheus-order-statuschange';
	public originLayer = 'erpprotheus';
	public serviceName = 'orderstatuschange.service';

	public constructor(public broker: ServiceBroker, schema: ServiceSchema) {
		super(broker);
	}

	@Event({
		name: 'service-erpProtheus-order-statusChange',
		group: 'flow-cremmer'
	})
	public async StatusOrderChange(message: IStatusOrderChenge) {
		try {
			const token: IGetToken = await getToken(
				process.env.PROTHEUSVIVEO_RESTCREMER
			);

			if (token.access_token) {
				const urlProtheusStatus =
					process.env.PROTHEUSVIVEO_BASEURL +
					process.env.PROTHEUSVIVEO_RESTCREMER +
					process.env.PROTHEUSVIVEO_URLORDERV2 +
					'?cNumCRM=' +
					message.cNumCRM +
					'&cOrigem=ISOCRM';

				const responseStatus = await AxiosRequestType(
					urlProtheusStatus,
					'',
					'get',
					{
						Authorization: 'Bearer' + token.access_token
					}
				);

				if (responseStatus.status == 200) {
					this.checkInitial = responseStatus.message;

					this.setStatusErp = this.checkInitial.cStatus;
					this.tipoCancelamento = this.checkInitial.cTipoCancelamento;
					this.grauParentesco = this.checkInitial.cGrauParentesco;

					switch (this.setStatusErp) {
						case '2': //PROCESSADO COM ERROS
							this.setStatuss = StatusIso.two; //Falha validacao
							break;
						case '3':
							this.setStatus = StatusIso.five; //FATURADO TOTAL
							break;
						case '4': //CANCELADO
							this.setStatus = StatusIso.three; //CANCELADO TOTAL
							break;
						case '5': //BLOQUEADO (NÃO FATURADO, APENAS ALTERADO)
							this.setStatus = StatusIso.one; //ABERTO E ENVIADO AO CRM
							break;
						case '6': //PARCIALMENTE FATURADO
							this.setStatus = StatusIso.four; //PARCIAL
							break;
						case '7': //PEDIDO CANCELADO
							this.setStatus = StatusIso.three; //CANCELADO TOTAL
							break;
						default:
							this.setStatus = '0';
							break;
					}

					if (this.setStatus == '3' && this.tipoCancelamento == 'R') {
						this.setStatus = StatusIso.six; //PARCIAL
					}

					if (this.setStatus != '0' && this.grauParentesco != '3') {
						const ordersStatusChanged: IUpdateOrders = {
							cEmpresa: this.checkInitial.cEmpresa,
							cNumCRM: this.checkInitial.cNumCRM,
							enumStatusIso: this.setStatus
						};

						await this.broker.broadcast(
							'service-integration-updateSetIso',
							ordersStatusChanged
						);
					}

					this.updateIntegrator = {
						tenantId: this.checkInitial.cEmpresa,
						orderId: this.checkInitial.cNumCRM,
						sourceCRM: 'ISOCRM',
						status: this.setStatus
					};

					await this.broker.broadcast(
						'service-integration-updatedStatus',
						this.updateIntegrator
					);

					loggerElastic(
						this.indexName,
						responseStatus.status.toString(),
						this.originLayer,
						this.serviceName,
						`get - ${urlProtheusStatus}`,
						JSON.stringify(responseStatus.message)
					);
				} else {
					loggerElastic(
						this.indexName,
						responseStatus.status.toString(),
						this.originLayer,
						this.serviceName,
						`get - ${urlProtheusStatus}`,
						JSON.stringify(responseStatus.message)
					);
				}
			}
		} catch (error) {
			loggerElastic(
				this.indexName,
				'499',
				this.originLayer,
				this.serviceName,
				JSON.stringify(error.message)
			);
			this.logger.error(error.message, 499);
		}
	}
}
