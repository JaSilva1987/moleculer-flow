import { Errors } from 'moleculer';
import { connectionCrmIso } from '../../../data-source';
import { IsoPvPedidoEntity } from '../../../entity/crmIso/tbIsoPvPedido.entity';
import { IUpdateOrders } from '../../../interface/crmIso/order/updateOrder.interface';

export const UpdateOrdersRepository = connectionCrmIso
	.getRepository(IsoPvPedidoEntity)
	.extend({
		async UpdateCrmIsoOrders(message: IUpdateOrders) {
			try {
				const crmOrdersCheck = await this.createQueryBuilder()
					.update(IsoPvPedidoEntity)
					.set({ ISOPvPedSit_Codigo: 16 })
					.where(
						'ISOEmp_Codigo = :ISOEmp_Codigo AND ISOPvPed_Codigo = :ISOPvPed_Codigo AND ISOPvPedSit_Codigo <> :ISOPvPedSit_Codigo',
						{
							ISOEmp_Codigo: message.cEmpresa,
							ISOPvPed_Codigo: message.cNumCRM,
							ISOPvPedSit_Codigo: message.enumStatusIso
						}
					)
					.execute();

				return crmOrdersCheck;
			} catch (error) {
				throw new Errors.MoleculerError(error.message, 100);
			}
		}
	});
