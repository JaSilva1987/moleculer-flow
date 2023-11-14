import { Errors } from 'moleculer';
import { connectionIntegrador } from '../../../data-source';
import { OrderChecksEntity } from '../../../entity/integration/orderCheck.entity';
import { IOrderCheck } from '../../../interface/integration/order';

export const OrderCheckRepository = connectionIntegrador
	.getRepository(OrderChecksEntity)
	.extend({
		async GetOrderCheckByPrimaryColumns(
			tenantId: string,
			orderId: string,
			sourceCRM: string,
			checkDescription: string
		): Promise<any> {
			try {
				const response = await this.find({
					where: { tenantId, orderId, sourceCRM, checkDescription }
				});

				return response;
			} catch (error) {
				throw new Errors.MoleculerRetryableError(
					error.message,
					error.code
				);
			}
		},

		async PutOrderCheck(message: IOrderCheck): Promise<IOrderCheck> {
			try {
				const putOrderChecks = await this.createQueryBuilder()
					.update(OrderChecksEntity)
					.set({
						commandSent: message.commandSent,
						nextTry: message.nextTry || new Date(),
						updatedAt: new Date(),
						responseCode: message.responseCode,
						response: message.response,
						validations_ok: message.validations_ok,
						sent: message.sent,
						success: message.success,
						retryNumber: message.retryNumber
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
					.andWhere('checkDescription = :checkDescription', {
						checkDescription: message.checkDescription
					})
					.execute();

				return putOrderChecks;
			} catch (error) {
				throw new Errors.MoleculerRetryableError(
					error.message,
					error.code
				);
			}
		},

		async PostOrderCheck(postMessage: IOrderCheck) {
			try {
				const postOrder = await this.createQueryBuilder()
					.insert()
					.into(OrderChecksEntity)
					.values(postMessage)
					.execute();

				return postOrder;
			} catch (error) {
				throw new Errors.MoleculerRetryableError(
					error.message,
					error.code
				);
			}
		}
	});
