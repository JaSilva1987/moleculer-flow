import { Errors } from 'moleculer';
import { connectionIntegrador } from '../../../data-source';
import { StockEcommerceEntity } from '../../../entity/integration/stockEcommerce.entity';
import { IStockEcommerceIntegration } from '../../../interface/integration/stock/stockEcommerce.interface';

export const StockEcommerceIntegrationRepository = connectionIntegrador
	.getRepository(StockEcommerceEntity)
	.extend({
		async GetStockEcommerceIntegration(
			productId: string
		): Promise<IStockEcommerceIntegration[]> {
			try {
				const result = await this.find({
					where: { productId }
				});

				return result;
			} catch (error) {
				throw new Errors.MoleculerError(error.message, 100);
			}
		},

		async PostStockEcommerceIntegration(
			message: IStockEcommerceIntegration
		) {
			try {
				const postMessage = await this.createQueryBuilder()
					.insert()
					.into(StockEcommerceEntity)
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

		async PutStockEcommerceIntegration(
			message: IStockEcommerceIntegration,
			id: number
		) {
			try {
				const putMessage = await this.createQueryBuilder()
					.update(StockEcommerceEntity)
					.set({
						quantity: message.quantity,
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
