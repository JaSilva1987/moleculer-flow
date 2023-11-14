import { ServiceBroker } from 'moleculer';
import { connectionCrmIso } from '../../../data-source';
import { VWFlowISOPedidoItensEntity } from '../../../entity/crmIso/vwFlowIsoPedidosItens.entity';
import { IPoolQueryOrders } from '../../../interface/crmIso/order';

let broker: ServiceBroker = new ServiceBroker();

export const CheckOrdersRepository = connectionCrmIso
	.getRepository(VWFlowISOPedidoItensEntity)
	.extend({
		async GetAllByCrmOrders() {
			try {
				const ordersCheck = await this.createQueryBuilder(
					'VWFlowISOPedidoItensEntity'
				)
					.select([])
					.distinct(true)
					.orderBy('ISOPvPed_Codigo')
					.getRawMany();
				return ordersCheck;
			} catch (error) {
				broker.logger.warn(
					'====> VWFlowISOPedidoItensEntity error: ' + error
				);
			}
		},

		async GetAllByOrders(
			ISOPvPed_Codigo: number,
			ISOPvPed_CliCodigo: string
		): Promise<IPoolQueryOrders[]> {
			try {
				const crmByOrdersCheck = await this.find({
					where: { ISOPvPed_Codigo, ISOPvPed_CliCodigo }
				});

				return crmByOrdersCheck;
			} catch (error) {
				broker.logger.warn('====> GetAllByOrders error: ' + error);
			}
		}
	});
