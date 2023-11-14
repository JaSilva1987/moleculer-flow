import { Errors } from 'moleculer';
import { connectionIntegrador } from '../../../data-source';
import { RequestOrderSalePfsEntity } from '../../../entity/integration/requestOrderSale.entity';
import { IRequestOrderSalePfsIntegration } from '../../../interface/integration/request/requestOrderSalePfs.interface';

export const RequestOrderSalePfsIntegrationRepository = connectionIntegrador
	.getRepository(RequestOrderSalePfsEntity)
	.extend({
		async GetRequestOrderSalePfsIntegration(
			cliente: string,
			num_pedido: string
		): Promise<IRequestOrderSalePfsIntegration[]> {
			try {
				const result = await this.find({
					where: { cliente, num_pedido }
				});

				return result;
			} catch (error) {
				throw new Errors.MoleculerError(error.message, 100);
			}
		},

		async PostRequestOrderSalePfsIntegration(
			message: IRequestOrderSalePfsIntegration
		) {
			try {
				const postMessage = await this.createQueryBuilder()
					.insert()
					.into(RequestOrderSalePfsEntity)
					.values(message)
					.execute();

				return postMessage;
			} catch (error) {
				throw new Errors.MoleculerRetryableError(
					error.message,
					error.code
				);
			}
		},

		async PutRequestOrderSalePfsIntegration(
			message: IRequestOrderSalePfsIntegration,
			id: number
		) {
			try {
				const putMessage = await this.createQueryBuilder()
					.update(RequestOrderSalePfsEntity)
					.set({
						JSON: message.JSON,
						status: message.status,
						updatedAt: new Date()
					})
					.where('id = :id', {
						id: id
					})
					.execute();

				return putMessage;
			} catch (error) {
				throw new Errors.MoleculerRetryableError(
					error.message,
					error.code
				);
			}
		}
	});
