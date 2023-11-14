import { Errors } from 'moleculer';
import { connectionIntegrador } from '../../../data-source';
import { triangulationTypeEntity } from '../../../entity/integration/triangulationType.entity';
import { ITriangulationTypeIntegration } from '../../../interface/integration/type/triangulatioTypeIntegration.interface';

export const TriangulationTypeIntegrationRepository = connectionIntegrador
	.getRepository(triangulationTypeEntity)
	.extend({
		async GetTriangulationTypePfsIntegration(
			triangulationType: string
		): Promise<ITriangulationTypeIntegration[]> {
			try {
				const result = await this.find({
					where: { triangulationType }
				});

				return result;
			} catch (error) {
				throw new Errors.MoleculerError(error.message, 100);
			}
		},

		async PostTriangulationTypePfsIntegration(
			message: ITriangulationTypeIntegration
		) {
			try {
				const postMessage = await this.createQueryBuilder()
					.insert()
					.into(triangulationTypeEntity)
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

		async PutTriangulationTypePfsIntegration(
			message: ITriangulationTypeIntegration,
			id: number
		) {
			try {
				const putMessage = await this.createQueryBuilder()
					.update(triangulationTypeEntity)
					.set({
						JSON: message.JSON,
						returnDataProtheus: message.returnDataProtheus,
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
