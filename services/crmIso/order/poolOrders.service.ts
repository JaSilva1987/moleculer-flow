'use strict';

import {
	Service as MoleculerService,
	ServiceBroker,
	ServiceSchema
} from 'moleculer';
import { Event, Service } from 'moleculer-decorators';
import { PoolCrmIsoOrdersController } from '../../../src/controller/crmIso/order/poolOrder.controller';
import { StatusIso } from '../../../src/enum/crmIso/enum';
import {
	IConfigLogCrmIso,
	IIConfigLogCrmIso
} from '../../../src/interface/crmIso/config/configLog.interface';
import { IOrderMessage } from '../../../src/interface/crmIso/order/poolCrmOrders.interface';
import { loggerElastic } from '../../library/elasticSearch';
import { SaveOrdersCrmIsoRepository } from '../../../src/repository/integration/order/orders.repository';

@Service({
	name: 'service.crmiso.order.poolOrders',
	group: 'flow-cremmer'
})
export default class OrdersService extends MoleculerService {
	public allPoolQueryCrmOrders: IOrderMessage[];
	public indexName = 'flow-integration-routeorders';
	public serviceName = 'poolorders.service';
	public originLayer = 'crmiso';
	logIso: IConfigLogCrmIso;

	public constructor(public broker: ServiceBroker, schema: ServiceSchema) {
		super(broker);
	}

	@Event({
		name: 'service-crmiso-order-poolQueryCrmOrders',
		group: 'flow-cremmer'
	})
	public async PoolQueryCrmOrders(ctx: any) {
		this.logger.info(
			'================> INICIO POOLQUERYCRMORDERS <================'
		);
		try {
			if (Boolean(ctx.params) == true) {
				const allPoolQueryCrmOrder = new PoolCrmIsoOrdersController(
					this.broker,
					this.schema
				);

				this.allPoolQueryCrmOrders =
					await allPoolQueryCrmOrder.PrepareMessage();

				if (
					typeof this.allPoolQueryCrmOrders != 'undefined' &&
					this.allPoolQueryCrmOrders != null &&
					this.allPoolQueryCrmOrders.length > 0
				) {
					for (
						let i = 0;
						i < this.allPoolQueryCrmOrders.length;
						i++
					) {
						setTimeout(() => ({}), 2000);

						if (
							this.allPoolQueryCrmOrders[i].TotalLinhas !=
							this.allPoolQueryCrmOrders[i].aItemPedido.length
						) {
							const upSixteen = {
								cEmpresa:
									this.allPoolQueryCrmOrders[i].cEmpresa,
								cNumCRM: this.allPoolQueryCrmOrders[i].cNumCRM,
								enumStatusIso: StatusIso.sixteen
							};

							await this.SentSetIso(upSixteen);

							// const logSixteen: IIConfigLogCrmIso = {
							// 	orderId: this.allPoolQueryCrmOrders[i].cNumCRM,
							// 	name: 'consultando_pedido',
							// 	status: 'OK',
							// 	description: 'Status ' + StatusIso.sixteen
							// };

							// await this.SentLogIso(logSixteen);

							const logJson: IIConfigLogCrmIso = {
								orderId: this.allPoolQueryCrmOrders[i].cNumCRM,
								name: 'consultando_pedido',
								status: 'OK',
								description: JSON.stringify(
									this.allPoolQueryCrmOrders[i]
								)
							};

							await this.SentLogIso(logJson);

							const upSeventeen = {
								cEmpresa:
									this.allPoolQueryCrmOrders[i].cEmpresa,
								cNumCRM: this.allPoolQueryCrmOrders[i].cNumCRM,
								enumStatusIso: StatusIso.seventeen
							};

							await this.SentSetIso(upSeventeen);

							const logSeventeen: IIConfigLogCrmIso = {
								orderId: this.allPoolQueryCrmOrders[i].cNumCRM,
								name: 'divergencia_quantidade_items_pedido',
								status: 'FALHA',
								description:
									'Status ' +
									StatusIso.seventeen +
									' Qtd de Itens do pedido difere do informado pelo CRM'
							};

							await this.SentLogIso(logSeventeen);
						} else if (
							this.allPoolQueryCrmOrders[i].cCondPagamento ==
							'S/ COND. DE PAGTO.'
						) {
							const upSixteen = {
								cEmpresa:
									this.allPoolQueryCrmOrders[i].cEmpresa,
								cNumCRM: this.allPoolQueryCrmOrders[i].cNumCRM,
								enumStatusIso: StatusIso.sixteen
							};

							await this.SentSetIso(upSixteen);

							// const logSixteen: IIConfigLogCrmIso = {
							// 	orderId: this.allPoolQueryCrmOrders[i].cNumCRM,
							// 	name: 'consultando_pedido',
							// 	status: 'OK',
							// 	description: 'Status ' + StatusIso.sixteen
							// };

							// await this.SentLogIso(logSixteen);

							const logJson: IIConfigLogCrmIso = {
								orderId: this.allPoolQueryCrmOrders[i].cNumCRM,
								name: 'consultando_pedido',
								status: 'OK',
								description: JSON.stringify(
									this.allPoolQueryCrmOrders[i]
								)
							};

							await this.SentLogIso(logJson);

							const upSeventeen = {
								cEmpresa:
									this.allPoolQueryCrmOrders[i].cEmpresa,
								cNumCRM: this.allPoolQueryCrmOrders[i].cNumCRM,
								enumStatusIso: StatusIso.seventeen
							};

							await this.SentSetIso(upSeventeen);

							const logSeventeen: IIConfigLogCrmIso = {
								orderId: this.allPoolQueryCrmOrders[i].cNumCRM,
								name: 'condicao_pagamento',
								status: 'FALHA',
								description:
									'Status ' +
									StatusIso.seventeen +
									' Não foi encontrada condição de pagamento corresponte no ERP Protheus.'
							};

							await this.SentLogIso(logSeventeen);
						} else {
							await this.broker.broadcast(
								'service-integration-order-saveOrdersCrmIso',
								this.allPoolQueryCrmOrders[i]
							);

							this.logIso = {
								orderId: this.allPoolQueryCrmOrders[i].cNumCRM,
								name: 'consultando_pedido',
								status: 'OK',
								description: JSON.stringify(
									this.allPoolQueryCrmOrders[i]
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
								this.logIso
							);
						}

						await loggerElastic(
							this.indexName,
							'200',
							this.originLayer,
							this.serviceName,
							JSON.stringify(ctx.params),
							JSON.stringify(this.allPoolQueryCrmOrders)
						);
					}
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
		}
	}

	public async SentLogIso(setLog: IIConfigLogCrmIso) {
		const logIso: IConfigLogCrmIso = {
			orderId: setLog.orderId,
			name: setLog.name,
			status: setLog.status,
			description: setLog.description,
			dateTimeSav: new Date(),
			dateTimeEvt: new Date(),
			branchId: null,
			orderIdERP: null,
			errorType: null,
			userViewer: null
		};

		await this.broker.broadcast('service.crmIso.saveLogCrmIso', logIso);
	}

	public async SentSetIso(updateIso: object) {
		await this.broker.broadcast(
			'service-integration-updateSetIso',
			updateIso
		);
	}
}
