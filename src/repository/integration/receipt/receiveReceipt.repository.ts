import { connectionIntegrador } from '../../../data-source';
import { EnumAlcis } from '../../../enum/alcis/enum';
import { setTimeout } from 'timers/promises';
import {
	IIReceiptReceivedConfirmation,
	IReceiptReceivedConfirmation,
	IReceiptReceivedConfirmationData
} from '../../../interface/alcis/receipt/receiptConfirmation/receiptConfirmation.interface';
import { ReceiveReceiptEntity } from '../../../entity/integration/receiveReceipt.entity';

const blockedSuccessProcess = false;

export const ReceiveReceiptRepository = connectionIntegrador
	.getRepository(ReceiveReceiptEntity)
	.extend({
		async PostOrders(
			putBody: IReceiptReceivedConfirmation
		): Promise<IIReceiptReceivedConfirmation> {
			try {
				await setTimeout(100);

				const getOrder: IReceiptReceivedConfirmationData =
					await this.findOne({
						where: {
							numeroDoRecebimento: putBody.numeroDoRecebimento,
							json: JSON.stringify(putBody),
							site: putBody.site
						}
					});

				if (!getOrder) {
					const postOrder = await this.save({
						site: putBody.site,
						numeroDoRecebimento: String(putBody.numeroDoRecebimento),
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
								.update(ReceiveReceiptEntity)
								.set({
									json: JSON.stringify(putBody),
									status: EnumAlcis.awaitProcess
								})
								.where(
									'numeroDoRecebimento = :numeroDoRecebimento AND site = :site',
									{
										numeroDoRecebimento:
											putBody.numeroDoRecebimento,
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
							.update(ReceiveReceiptEntity)
							.set({
								json: JSON.stringify(putBody),
								status: EnumAlcis.awaitProcess
							})
							.where(
								'numeroDoRecebimento = :numeroDoRecebimento AND site = :site',
								{
									numeroDoRecebimento:
										putBody.numeroDoRecebimento,
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

		async GetOrdersm02(
			site: string,
			status: string
		): Promise<Array<object>> {
			const getOrdersConfirmation: [] = await this.find({
				where: {
					site: site,
					status: status
				}
			});

			return getOrdersConfirmation;
		},

		async GetOrdersm21(
			site: string,
			status: string
		): Promise<Array<object>> {
			const getOrdersConfirmation: [] = await this.find({
				where: {
					site: site,
					status: status
				}
			});

			return getOrdersConfirmation;
		},

		async GetOrdersm10(
			site: string,
			status: string
		): Promise<Array<object>> {
			const getOrdersConfirmation: [] = await this.find({
				where: {
					site: site,
					status: status
				}
			});

			return getOrdersConfirmation;
		},

		async GetOrdersm13(
			site: string,
			status: string
		): Promise<Array<object>> {
			const getOrdersConfirmation: [] = await this.find({
				where: {
					site: site,
					status: status
				}
			});

			return getOrdersConfirmation;
		},

		async GetOrdersm15(
			site: string,
			status: string
		): Promise<Array<object>> {
			const getOrdersConfirmation: [] = await this.find({
				where: {
					site: site,
					status: status
				}
			});

			return getOrdersConfirmation;
		},

		async GetOrdersm23(
			site: string,
			status: string
		): Promise<Array<object>> {
			const getOrdersConfirmation: [] = await this.find({
				where: {
					site: site,
					status: status
				}
			});

			return getOrdersConfirmation;
		},

		async GetOrdersm24(
			site: string,
			status: string
		): Promise<Array<object>> {
			const getOrdersConfirmation: [] = await this.find({
				where: {
					site: site,
					status: status
				}
			});

			return getOrdersConfirmation;
		},

		async PutOrders(
			putProcess: IReceiptReceivedConfirmationData
		): Promise<IIReceiptReceivedConfirmation> {
			try {
				const putOrder = await this.createQueryBuilder()
					.update(ReceiveReceiptEntity)
					.set({
						status: putProcess.status
					})
					.where('numeroDoRecebimento = :numeroDoRecebimento AND site = :site', {
						numeroDoRecebimento: putProcess.numeroDoRecebimento,
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
