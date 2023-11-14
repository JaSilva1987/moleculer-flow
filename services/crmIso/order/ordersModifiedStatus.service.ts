'use strict';

import {
	Service as MoleculerService,
	ServiceBroker,
	ServiceSchema
} from 'moleculer';
import { Event, Service } from 'moleculer-decorators';
import { connectionCrmIso } from '../../../src/data-source';
import { StatusIso } from '../../../src/enum/crmIso/enum';
import { IUpdateStatusOrders } from '../../../src/interface/crmIso/order/updateStatusOrder.interface';
import { UpdateOrdersStatusRepository } from '../../../src/repository/crmIso/order/updateStatusCrmIsoOrder.repository';
import { loggerElastic } from '../../library/elasticSearch';

@Service({
	name: 'service.crmiso.order.ordersModifiedStatus',
	group: 'flow-cremmer'
})
export default class OrdersModifiedStatusOf extends MoleculerService {
	public indexName = 'flow-integration-routeorders';
	public serviceName = 'ordersModifiedStatus.service';
	public originLayer = 'crmIso/order';
	public statusElastic: '200';
	statusCrm: number;
	dsStatus: string;

	public constructor(public broker: ServiceBroker, schema: ServiceSchema) {
		super(broker);
	}

	async started() {
		try {
			await connectionCrmIso.initialize();
		} catch (error) {
			loggerElastic(
				this.indexName,
				'500',
				this.originLayer,
				this.serviceName,
				'',
				JSON.stringify(error.message)
			);
			this.logger.error(error.message);
		}
	}

	@Event({
		name: 'service.crmIso.order.ordersModified',
		group: 'flow-cremmer'
	})
	public async OrdersModified(message: any) {
		if (typeof message === 'string') {
			message = JSON.parse(message);
		} else {
			message = JSON.parse(JSON.stringify(message));
		}

		this.logger.info(
			'======= INICIO ALTERAÇÃO STATUS ISO =======\n' +
				JSON.stringify(message)
		);
		try {
			switch (message.status) {
				case '2': //Falha validacao
					this.statusCrm = StatusIso.seventeen;
					this.dsStatus = 'FALHA NA VALIDACAO';
					break;
				case '3': //Cancelado
					this.statusCrm = StatusIso.nine;
					this.dsStatus = 'PEDIDO CANCELADO';
					break;
				case '4': //Faturado Parcial
					this.statusCrm = StatusIso.six;
					this.dsStatus = 'FATURADO PARCIAL';
					break;
				case '5': //Faturado Total
					this.statusCrm = StatusIso.seven;
					this.dsStatus = 'FATURADO TOTAL';
					break;
				case '6': //Alterado
					this.statusCrm = StatusIso.eight;
					this.dsStatus = 'REABERTO POR ALTERACAO';
					break;

				default: //Integrado
					this.statusCrm = StatusIso.thirty_seven;
					this.dsStatus = 'ABERTO (INTEGRADO)';
					break;
			}

			const objStatus = {
				statusCrm: this.statusCrm,
				dsStatus: this.dsStatus
			};

			const updateValues: IUpdateStatusOrders = {
				ISOPvPedSit_Codigo: this.statusCrm,
				ISOEmp_Codigo: Number(message.tenantId),
				ISOPvPed_Codigo: Number(message.orderId)
			};

			let updatedStatusOrder =
				await UpdateOrdersStatusRepository.UpdateStatusCrmIsoOrders(
					updateValues
				);

			loggerElastic(
				this.indexName,
				'200',
				this.originLayer,
				this.serviceName,
				JSON.stringify(objStatus),
				JSON.stringify(updatedStatusOrder)
			);
		} catch (error) {
			loggerElastic(
				this.indexName,
				'499',
				this.originLayer,
				this.serviceName,
				JSON.stringify(message),
				JSON.stringify(error.message)
			);
		}
	}

	async stoped() {
		return await connectionCrmIso.destroy();
	}
}
