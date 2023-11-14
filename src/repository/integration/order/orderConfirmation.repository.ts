import { connectionIntegrador } from '../../../data-source';
import { OrderConfirmationEntity } from '../../../entity/integration/orderConfirmation.entity';
import { EnumAlcis } from '../../../enum/alcis/enum';
import { setTimeout } from 'timers/promises';
import { IOrderConfirmation } from '../../../interface/alcis/order/orderConfirmation/newConfirmationOrder.interface';
import {
	IIOrderConfirmation,
	IOrderConfirmationData
} from '../../../interface/alcis/order/orderConfirmation/orderConfirmation.interface';

const blockedSuccessProcess = false;

export const OrderConfirmationRepository = connectionIntegrador
	.getRepository(OrderConfirmationEntity)
	.extend({
		async PostOrders(
			putBody: IOrderConfirmation
		): Promise<IIOrderConfirmation> {
			try {
				await setTimeout(100);

				const getOrder: IOrderConfirmationData = await this.findOne({
					where: {
						numeroPedido: putBody.numeroPedido,
						json: JSON.stringify(putBody),
						site: putBody.site
					}
				});

				if (!getOrder) {
					const postOrder = await this.save({
						site: putBody.site,
						numeroPedido: putBody.numeroPedido,
						json: JSON.stringify(putBody),
						status: EnumAlcis.awaitProcess
					});

					if (postOrder) {
						return {
							status: 200,
							message: EnumAlcis.recivedProcess
						};
					} else {
						throw new Error(EnumAlcis.existProcess);
					}
				} else {
					if (blockedSuccessProcess) {
						if (getOrder.status == EnumAlcis.notIntegrate) {
							const putOrder = await this.createQueryBuilder()
								.update(OrderConfirmationEntity)
								.set({
									json: JSON.stringify(putBody),
									status: EnumAlcis.awaitProcess
								})
								.where(
									'numeroPedido = :numeroPedido AND site = :site',
									{
										numeroPedido: putBody.numeroPedido,
										site: putBody.site
									}
								)
								.execute();

							if (putOrder) {
								return {
									status: 200,
									message: EnumAlcis.existProcessUpdate
								};
							} else {
								throw new Error(EnumAlcis.errUpdate);
							}
						} else {
							throw new Error(EnumAlcis.errUpdate);
						}
					} else {
						const putOrder = await this.createQueryBuilder()
							.update(OrderConfirmationEntity)
							.set({
								json: JSON.stringify(putBody),
								status: EnumAlcis.awaitProcess
							})
							.where(
								'numeroPedido = :numeroPedido AND site = :site',
								{
									numeroPedido: putBody.numeroPedido,
									site: putBody.site
								}
							)
							.execute();

						if (putOrder) {
							return {
								status: 200,
								message: EnumAlcis.existProcessUpdate
							};
						} else {
							throw new Error(EnumAlcis.errUpdate);
						}
					}
				}
			} catch (error) {
				const errorMapping: any = {
					[EnumAlcis.recivedData]: EnumAlcis.recivedData,
					[EnumAlcis.awaitProcess]: EnumAlcis.awaitProcess,
					[EnumAlcis.recivedProcess]: EnumAlcis.recivedProcess,
					[EnumAlcis.existProcess]: EnumAlcis.existProcess,
					[EnumAlcis.existProcessUpdate]:
						EnumAlcis.existProcessUpdate,
					[EnumAlcis.errUpdate]: EnumAlcis.errUpdate
				};

				const mappedMessage: any =
					errorMapping[error.message] ||
					'Erro no processo de gravação integration layer';

				return {
					status: 424,
					message: mappedMessage
				};
			}
		},

		async GetOrders(site: string, status: string): Promise<Array<object>> {
			const getOrdersConfirmation: [] = await this.find({
				where: {
					site: site,
					status: status
				}
			});

			return getOrdersConfirmation;
		},

		async PutOrders(
			putProcess: IOrderConfirmationData
		): Promise<IIOrderConfirmation> {
			try {
				const putOrder = await this.createQueryBuilder()
					.update(OrderConfirmationEntity)
					.set({
						status: putProcess.status
					})
					.where('numeroPedido = :numeroPedido AND site = :site', {
						numeroPedido: putProcess.numeroPedido,
						site: putProcess.site
					})
					.execute();

				if (putOrder) {
					return {
						status: 200
					};
				} else {
					throw new Error('Error');
				}
			} catch (error) {
				return {
					status: 424
				};
			}
		}
	});
