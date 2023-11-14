import dayjs from 'dayjs';
import { ServiceBroker, ServiceSchema } from 'moleculer';
import { loggerElastic } from '../../../../services/library/elasticSearch';
import { StatusIso } from '../../../enum/crmIso/enum';
import { IConfigLogCrmIso } from '../../../interface/crmIso/config/configLog.interface';
import { IIIPoolCheckChangedOf } from '../../../interface/crmIso/order';
import { IUpdateStatusOrders } from '../../../interface/crmIso/order/updateStatusOrder.interface';
import { IUpdateIsoPvPedItem } from '../../../interface/crmIso/orderFat/updateIsoPvPedItem.interface';
import {
	IProcessManutOf,
	IUpdateManutOf
} from '../../../interface/crmIso/orderFat/updateManutOf.interface';
import { IUpdateOrderField } from '../../../interface/erpProtheus/order';
import { UpdateOrdersStatusRepository } from '../../../repository/crmIso/order/updateStatusCrmIsoOrder.repository';
import { UpdateIsoPvPedItemRepository } from '../../../repository/crmIso/orderFat/updateIsoPvPedItem.repository';
import { UpdateManutOfRepository } from '../../../repository/crmIso/orderFat/updateManutOf.repository';
import 'dayjs/locale/pt-br';

export class ManutOfsController {
	public indexName = 'flow-crmiso-manutof';
	public serviceName = 'ManutOfsController';
	public originLayer = 'flow-cremmer';
	returnUpdateManutOf: number;

	public constructor(public broker: ServiceBroker, schema: ServiceSchema) {}

	public async updateManutOf(ctxMessage: IProcessManutOf) {
		dayjs.locale('pt-br');

		try {
			const arrJsonIso: IIIPoolCheckChangedOf = JSON.parse(
				ctxMessage.jsonCrm
			);
			const arrJsonErp: IUpdateOrderField = JSON.parse(
				ctxMessage.jsonErp
			);
			const newDate = dayjs(
				new Date().toISOString().replace('T', ' ').replace('Z', '')
			)
				.subtract(3, 'hour')
				.format('YYYY-MM-DD HH:mm:ss:SSS');

			const setDate = String(newDate);

			const logIso: IConfigLogCrmIso = {
				orderId: ctxMessage.orderId,
				name: 'atualizando_campos',
				status: ctxMessage.statusCode === 200 ? 'OK' : 'FALHA',
				description: JSON.stringify(arrJsonErp),
				dateTimeSav: new Date(),
				dateTimeEvt: new Date(),
				branchId: ctxMessage.branchId,
				orderIdERP: ctxMessage.orderIdERP,
				errorType: null,
				userViewer: null
			};

			await this.broker.broadcast('service.crmIso.saveLogCrmIso', logIso);

			const sendDataToUpdateManutOf: IUpdateManutOf = {
				ManOF_Processado: 'S',
				ManOF_Filial: ctxMessage.branchId,
				ManOF_OFNro: ctxMessage.orderIdERP,
				ManOF_NroPedidoCRM: ctxMessage.orderId,
				ManOF_Seq: arrJsonIso.aItemPedido.Seq,
				ManOF_DHProc: new Date(setDate)
			};

			if (ctxMessage.manutType == 'header') {
				if (arrJsonIso.aItemPedido.Cancelar_pedido == 'S') {
					const updateValues: IUpdateStatusOrders = {
						ISOPvPedSit_Codigo: StatusIso.nine,
						ISOEmp_Codigo: Number(ctxMessage.tenantId),
						ISOPvPed_Codigo: Number(ctxMessage.orderId)
					};

					await UpdateOrdersStatusRepository.UpdateStatusCrmIsoOrders(
						updateValues
					);
				}

				if (arrJsonIso.aItemPedido.Voltar_Pedido_ISO == 'S') {
					const updateValues: IUpdateStatusOrders = {
						ISOPvPedSit_Codigo: StatusIso.eight,
						ISOEmp_Codigo: Number(ctxMessage.tenantId),
						ISOPvPed_Codigo: Number(ctxMessage.orderId)
					};

					await UpdateOrdersStatusRepository.UpdateStatusCrmIsoOrders(
						updateValues
					);
				}
			}

			const dateLines = `${arrJsonIso.aItemPedido.ITEM_DataPrevFat.substring(
				0,
				4
			)}-${arrJsonIso.aItemPedido.ITEM_DataPrevFat.substring(
				4,
				6
			)}-${arrJsonIso.aItemPedido.ITEM_DataPrevFat.substring(
				6,
				8
			)} 00:00:00.000`;

			const updateCrmLines: IUpdateIsoPvPedItem = {
				ISOPvPedIteSit_Codigo: 9,
				ISOEmp_Codigo: ctxMessage.tenantId,
				ISOPvPed_Codigo: ctxMessage.orderId,
				ISOPvPedIte_DtaSolEntrega: new Date(dateLines),
				ISOPvPedIte_Codigo: arrJsonIso.aItemPedido.ITEM_Seq_CRM.trim()
			};

			if (
				arrJsonIso.aItemPedido.ITEM_CancSaldo.trim() === 'S' &&
				arrJsonIso.aItemPedido.ITEM_Seq_CRM.trim() != '' &&
				ctxMessage.statusCode === 200
			) {
				await UpdateIsoPvPedItemRepository.UpdateCancelCrmIsoOrders(
					updateCrmLines
				);
			}

			if (
				arrJsonIso.aItemPedido.ITEM_DataPrevFat.trim() != '' &&
				arrJsonIso.aItemPedido.ITEM_Seq_CRM.trim() != '' &&
				ctxMessage.statusCode === 200
			) {
				await UpdateIsoPvPedItemRepository.UpdateDateTimeCrmIsoOrders(
					updateCrmLines
				);
			}

			this.returnUpdateManutOf =
				await UpdateManutOfRepository.UpdateCrmIsoManutOf(
					sendDataToUpdateManutOf
				);

			loggerElastic(
				this.indexName,
				'200',
				this.originLayer,
				this.serviceName,
				JSON.stringify(logIso),
				''
			);
		} catch (error) {
			loggerElastic(
				this.indexName,
				'499',
				this.originLayer,
				this.serviceName,
				JSON.stringify(ctxMessage),
				JSON.stringify([error])
			);
		}
	}
}
