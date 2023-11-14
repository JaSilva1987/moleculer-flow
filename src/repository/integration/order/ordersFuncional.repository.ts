import { OrdersEntity } from '../../../entity/integration/orderCrmIso.entity';
import { ISaveOrders } from '../../../interface/integration/order/saveOrder.interface';
import { connectionIntegrador } from '../../../data-source';
import { Errors } from 'moleculer';
import { StatusIntegrador } from '../../../enum/integration/enum';

export const SaveOrdersFuncionalRepository = connectionIntegrador
	.getRepository(OrdersEntity)
	.extend({
		async GetOrdersFuncional(
			tenantId: string,
			orderId: string,
			sourceCRM: string,
			branchId: string
		): Promise<ISaveOrders> {
			try {
				const client = await this.findOne({
					where: { tenantId, orderId, sourceCRM, branchId }
				});

				return client;
			} catch (error) {
				throw new Errors.MoleculerError(error.message, 100);
			}
		},

		async PostOrdersFuncional(postMessage: ISaveOrders) {
			try {
				const postOrder = await this.createQueryBuilder()
					.insert()
					.into(OrdersEntity)
					.values(postMessage)
					.execute();

				return postOrder;
			} catch (error) {
				throw new Errors.MoleculerError(error.message, 100);
			}
		},

		async PutOrdersFuncional(message: ISaveOrders): Promise<ISaveOrders> {
			try {
				const putOrder = this.createQueryBuilder()
					.update(OrdersEntity)
					.set({
						updatedAt: new Date(),
						json_order: JSON.stringify(message.json_order),
						status: message.status
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
					.andWhere('branchId = :branchId', {
						branchId: message.branchId
					})
					.execute();

				return putOrder;
			} catch (error) {
				throw new Errors.MoleculerRetryableError(error.message, 100);
			}
		},

		async CheckOrdersFuncional(
			sourceCRM: string,
			status: string
		): Promise<ISaveOrders> {
			try {
				const client = ([] = await this.find({
					where: { sourceCRM, status }
				}));

				return client;
			} catch (error) {
				throw new Errors.MoleculerError(error.message, 100);
			}
		},

		async PutStatusFuncional(message: ISaveOrders) {
			try {
				const updatedOrder =
					message.orderIdERP != undefined ? message.orderIdERP : null;
				const putOrders = this.createQueryBuilder()
					.update(OrdersEntity)
					.set({
						updatedAt: new Date(),
						orderIdERP: updatedOrder,
						status: message.status
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
					.andWhere('branchId = :branchId', {
						branchId: message.branchId
					})
					.execute();

				return putOrders;
			} catch (error) {
				throw new Errors.MoleculerError(error.message, 100);
			}
		},

		async GetOrdersStatusFuncional(
			sourceCRM: string
		): Promise<ISaveOrders> {
			try {
				const client = ([] = await this.find({
					where: {
						sourceCRM: sourceCRM,
						status: StatusIntegrador.integrateProtheus
					}
				}));

				return client;
			} catch (error) {
				throw new Errors.MoleculerError(error.message, 100);
			}
		}
	});
