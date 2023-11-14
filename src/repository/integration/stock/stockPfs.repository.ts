import { Errors } from 'moleculer';
import { connectionIntegrador } from '../../../data-source';
import { StockPfsEntity } from '../../../entity/integration/stockPfs.entity';
import { IStockPfsIntegration } from '../../../interface/integration/stock/stockPfs.interface';

export const StockPfsIntegrationRepository = connectionIntegrador
	.getRepository(StockPfsEntity)
	.extend({
		async GetStockPfsIntegration(
			codigoEan: string,
			armazen: string
		): Promise<IStockPfsIntegration[]> {
			try {
				const result = await this.find({
					where: { codigoEan, armazen }
				});

				return result;
			} catch (error) {
				throw new Errors.MoleculerError(error.message, 100);
			}
		},

		async PostStockPfsIntegration(message: IStockPfsIntegration) {
			try {
				const postMessage = await this.createQueryBuilder()
					.insert()
					.into(StockPfsEntity)
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

		async PutStockPfsIntegration(
			message: IStockPfsIntegration,
			id: number
		) {
			try {
				const putMessage = await this.createQueryBuilder()
					.update(StockPfsEntity)
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
