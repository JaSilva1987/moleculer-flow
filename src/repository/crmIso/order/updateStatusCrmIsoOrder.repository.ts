import { ServiceBroker } from 'moleculer';
import { connectionCrmIso } from '../../../data-source';
import { IsoPvPedidoEntity } from '../../../entity/crmIso/tbIsoPvPedido.entity';
import { IUpdateStatusOrders } from '../../../interface/crmIso/order/updateStatusOrder.interface';

let broker: ServiceBroker;

export const UpdateOrdersStatusRepository = connectionCrmIso
	.getRepository(IsoPvPedidoEntity)
	.extend({
		async UpdateStatusCrmIsoOrders(message: IUpdateStatusOrders) {
			try {
				const crmOrdersCheck = await this.createQueryBuilder()
					.update(IsoPvPedidoEntity)
					.set({ ISOPvPedSit_Codigo: message.ISOPvPedSit_Codigo })
					.where(
						'ISOEmp_Codigo = :ISOEmp_Codigo AND ISOPvPed_Codigo = :ISOPvPed_Codigo AND ISOPvPedSit_Codigo <> :ISOPvPedSit_Codigo',
						{
							ISOEmp_Codigo: message.ISOEmp_Codigo,
							ISOPvPed_Codigo: message.ISOPvPed_Codigo,
							ISOPvPedSit_Codigo: message.ISOPvPedSit_Codigo
						}
					)
					.execute();

				return crmOrdersCheck;
			} catch (error) {
				broker.logger.warn(
					'====> Update orders status error: ' + error
				);
			}
		}
	});
