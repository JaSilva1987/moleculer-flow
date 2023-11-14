import { ServiceBroker } from 'moleculer';
import { connectionCrmIso } from '../../../data-source';
import { VWFlowManutOfEntity } from '../../../entity/crmIso/VWFlowManutOf.entity';
import { IPoolCheckChangedOf } from '../../../interface/crmIso/order/poolCheckChangeOf.interface';

let broker: ServiceBroker;

export const VwFlowManutOfRepository = connectionCrmIso
	.getRepository(VWFlowManutOfEntity)
	.extend({
		async GetAll() {
			try {
				const manutOfCheck = await this.createQueryBuilder(
					'VWFlowManutOfEntity'
				)
					.select([])
					.distinct(true)
					.orderBy('Nro_Pedido_CRM')
					.getRawMany();
				return manutOfCheck;
			} catch (error) {
				broker.logger.warn('====> VWFlowManutOfEntity error: ' + error);
			}
		},

		async GetFilterView(
			Nro_Pedido_CRM: string,
			FILIAL: string
		): Promise<IPoolCheckChangedOf[]> {
			try {
				const checkViewManut = await this.find({
					where: { Nro_Pedido_CRM, FILIAL }
				});

				return checkViewManut;
			} catch (error) {
				broker.logger.warn(
					'====> Consult view filters VWFlowManutOfEntity error: ' +
						error
				);
			}
		}
	});
