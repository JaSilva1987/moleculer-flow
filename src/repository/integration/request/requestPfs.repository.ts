import { Errors } from 'moleculer';
import { connectionIntegrador } from '../../../data-source';
import { RequestPfsEntity } from '../../../entity/integration/requestPfs.entity';
import { IRequestPfsIntegration } from '../../../interface/integration/request/requestPfs.interface';

export const RequestPfsIntegrationRepository = connectionIntegrador
	.getRepository(RequestPfsEntity)
	.extend({
		async GetRequestPfsIntegration(
			cliente: string,
			num_pedido: string
		): Promise<IRequestPfsIntegration[]> {
			try {
				const result = await this.find({
					where: { cliente, num_pedido }
				});

				return result;
			} catch (error) {
				throw new Errors.MoleculerError(error.message, 100);
			}
		},

		async PostRequestPfsIntegration(message: IRequestPfsIntegration) {
			try {
				const postMessage = await this.createQueryBuilder()
					.insert()
					.into(RequestPfsEntity)
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

		async PutRequestPfsIntegration(
			message: IRequestPfsIntegration,
			id: number
		) {
			try {
				const putMessage = await this.createQueryBuilder()
					.update(RequestPfsEntity)
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
