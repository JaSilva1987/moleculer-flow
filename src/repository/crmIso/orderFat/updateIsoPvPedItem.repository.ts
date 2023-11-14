import { ServiceBroker } from 'moleculer';
import { connectionCrmIso } from '../../../data-source';
import { IsoPvPedItemEntity } from '../../../entity/crmIso/tbIsoPvPedItem.entity';
import { IUpdateIsoPvPedItem } from '../../../interface/crmIso/orderFat/updateIsoPvPedItem.interface';

let broker: ServiceBroker;

export const UpdateIsoPvPedItemRepository = connectionCrmIso
	.getRepository(IsoPvPedItemEntity)
	.extend({
		async UpdateCrmIsoPvPedItemQauntityZero(message: IUpdateIsoPvPedItem) {
			try {
				const crmIsoPvPedItem = await this.createQueryBuilder()
					.update(IsoPvPedItemEntity)
					.set({
						ISOPvPedIteSit_Codigo: message.ISOPvPedIteSit_Codigo,
						ISOPvPedIteMoc_Codigo: message.ISOPvPedIteMoc_Codigo
					})
					.where(
						'ISOEmp_Codigo = :ISOEmp_Codigo AND ISOPvPed_Codigo = :ISOPvPed_Codigo AND ISOPvPedIte_Codigo = :ISOPvPedIte_Codigo',
						{
							ISOEmp_Codigo: message.ISOEmp_Codigo,
							ISOPvPed_Codigo: message.ISOPvPed_Codigo,
							ISOPvPedIte_Codigo: message.ISOPvPedIte_Codigo
						}
					)
					.execute();

				return crmIsoPvPedItem;
			} catch (error) {
				broker.logger.warn(
					'====> UpdateCrmIsoPvPedItemQauntityZero error: ' + error
				);
			}
		},

		async UpdateCrmIsoPvPedItemQauntityNotZero(
			message: IUpdateIsoPvPedItem
		) {
			try {
				const crmIsoPvPedItem = await this.createQueryBuilder()
					.update(IsoPvPedItemEntity)
					.set({
						ISOPvPedIte_Quantidade: message.ISOPvPedIte_Quantidade
					})
					.where(
						'ISOEmp_Codigo = :ISOEmp_Codigo AND ISOPvPed_Codigo = :ISOPvPed_Codigo AND ISOPvPedIte_Codigo = :ISOPvPedIte_Codigo',
						{
							ISOEmp_Codigo: message.ISOEmp_Codigo,
							ISOPvPed_Codigo: message.ISOPvPed_Codigo,
							ISOPvPedIte_Codigo: message.ISOPvPedIte_Codigo
						}
					)
					.execute();

				return crmIsoPvPedItem;
			} catch (error) {
				broker.logger.warn(
					'====> UpdateCrmIsoPvPedItemQauntityNotZero error: ' + error
				);
			}
		},

		async UpdateCancelCrmIsoOrders(message: IUpdateIsoPvPedItem) {
			try {
				const UpdatecrmIsoPvPedItem = await this.createQueryBuilder()
					.update(IsoPvPedItemEntity)
					.set({
						ISOPvPedIteSit_Codigo: message.ISOPvPedIteSit_Codigo
					})
					.where(
						'ISOEmp_Codigo = :ISOEmp_Codigo AND ISOPvPed_Codigo = :ISOPvPed_Codigo AND ISOPvPedIte_Codigo = :ISOPvPedIte_Codigo',
						{
							ISOEmp_Codigo: message.ISOEmp_Codigo,
							ISOPvPed_Codigo: message.ISOPvPed_Codigo,
							ISOPvPedIte_Codigo: message.ISOPvPedIte_Codigo
						}
					)
					.execute();

				return UpdatecrmIsoPvPedItem;
			} catch (error) {
				broker.logger.warn(
					'====> UpdateCancelCrmIsoOrders error: ' + error
				);
			}
		},

		async UpdateDateTimeCrmIsoOrders(message: IUpdateIsoPvPedItem) {
			try {
				const DatecrmIsoPvPedItem = await this.createQueryBuilder()
					.update(IsoPvPedItemEntity)
					.set({
						ISOPvPedIte_DtaSolEntrega:
							message.ISOPvPedIte_DtaSolEntrega
					})
					.where(
						'ISOEmp_Codigo = :ISOEmp_Codigo AND ISOPvPed_Codigo = :ISOPvPed_Codigo AND ISOPvPedIte_Codigo = :ISOPvPedIte_Codigo',
						{
							ISOEmp_Codigo: message.ISOEmp_Codigo,
							ISOPvPed_Codigo: message.ISOPvPed_Codigo,
							ISOPvPedIte_Codigo: message.ISOPvPedIte_Codigo
						}
					)
					.execute();

				return DatecrmIsoPvPedItem;
			} catch (error) {
				broker.logger.warn(
					'====> UpdateDateTimeCrmIsoOrders error: ' + error
				);
			}
		}
	});
