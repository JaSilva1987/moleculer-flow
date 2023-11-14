import { Errors, ServiceBroker } from 'moleculer';
import { Between, MoreThan } from 'typeorm';
import { connectionIntegrador } from '../../../data-source';
import { OrdersEntity } from '../../../entity/integration/orderCrmIso.entity';
import { StatusIntegrador } from '../../../enum/integration/enum';
import { ISaveOrders } from '../../../interface/integration/order/saveOrder.interface';

let broker: ServiceBroker;

export const SaveOrdersCrmIsoRepository = connectionIntegrador
	.getRepository(OrdersEntity)
	.extend({
		async GetAllByOrders(
			tenantId: string,
			orderId: string,
			sourceCRM: string
		): Promise<ISaveOrders> {
			try {
				const client = await this.findOne({
					where: { tenantId, orderId, sourceCRM }
				});

				return client;
			} catch (error) {
				throw new Errors.MoleculerRetryableError(error.message, 100);
			}
		},

		async PostByOrders(postMessage: ISaveOrders) {
			try {
				await this.manager.transaction(
					async (transactionalEntityManager: {
						save: (
							arg0: typeof OrdersEntity,
							arg1: ISaveOrders
						) => any;
					}) => {
						await transactionalEntityManager.save(
							OrdersEntity,
							postMessage
						);
					}
				);
			} catch (error) {
				throw new Errors.MoleculerRetryableError(error.message, 100);
			}
		},

		async PutUpStatus(message: ISaveOrders): Promise<ISaveOrders> {
			try {
				const numberOf =
					message.orderIdERP != undefined ? message.orderIdERP : null;
				const putOrders = this.createQueryBuilder()
					.update(OrdersEntity)
					.set({
						orderIdERP: numberOf,
						branchId: message.branchId,
						status: message.status,
						updatedAt: new Date()
					})
					.where('tenantId = :tenantId', {
						tenantId: message.tenantId
					})
					.andWhere('orderId = :orderId', {
						orderId: message.orderId
					})
					.andWhere('sourceCRM = :sourceCRM', {
						sourceCRM: message.sourceCRM
					})
					.execute();

				return putOrders;
			} catch (error) {
				throw new Errors.MoleculerRetryableError(error.message, 100);
			}
		},

		async GetByAllStatus(
			status: string,
			startDate: string,
			endDate: string
		): Promise<OrdersEntity[]> {
			try {
				const pendingOrders = this.find({
					where: {
						updatedAt: Between(
							new Date(startDate),
							new Date(endDate)
						),
						status: status
					}
				});

				return pendingOrders;
			} catch (error) {
				broker.logger.warn(error);
			}
		},

		async GetPayment(checkDatabase: ISaveOrders): Promise<OrdersEntity> {
			try {
				const pendingOrders = await this.findOne({
					where: {
						tenantId: checkDatabase.tenantId,
						orderId: checkDatabase.orderId,
						sourceCRM: checkDatabase.sourceCRM,
						status: checkDatabase.status
					}
				});

				return pendingOrders;
			} catch (error) {
				broker.logger.warn(error);
			}
		},

		async PutByOrders(message: any): Promise<ISaveOrders> {
			try {
				const putOrder = this.createQueryBuilder()
					.update(OrdersEntity)
					.set({
						updatedAt: new Date(),
						json_order: JSON.stringify(message),
						status: StatusIntegrador.receivedOrigin
					})
					.where('tenantId = :tenantId', {
						tenantId: message.cEmpresa
					})
					.andWhere('orderId = :orderId', {
						orderId: message.cNumCRM
					})
					.andWhere('sourceCRM = :sourceCRM', {
						sourceCRM: message.cOrigem
					})
					.execute();

				return putOrder;
			} catch (error) {
				throw new Errors.MoleculerRetryableError(error.message, 100);
			}
		},

		async GetStatusByUpdated(status: string, dateAlter: string) {
			try {
				const statusFlow = await this.find({
					where: {
						status,
						createdAt: MoreThan(dateAlter)
					}
				});

				return statusFlow;
			} catch (error) {
				throw new Errors.MoleculerRetryableError(error.message, 100);
			}
		},

		async GetStatus(status: string) {
			try {
				const statusFlow = await this.find({ where: { status } });

				return statusFlow;
			} catch (error) {
				throw new Errors.MoleculerRetryableError(error.message, 100);
			}
		}
	});
