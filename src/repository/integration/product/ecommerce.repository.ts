import { Errors } from 'moleculer';
import { connectionIntegrador } from '../../../data-source';
import { EcommerceProductsEntity } from '../../../entity/integration/productEcommerce.entity';
import { statusEcommerceIntegration } from '../../../enum/integration/statusEcommerceProducts.enum';
import { IEcommerceProductIntegration } from '../../../interface/integration/product/EcommerceProduct.interface';

export const EcommerceProductIntegrationRepository = connectionIntegrador
	.getRepository(EcommerceProductsEntity)
	.extend({
		async GetEcommerceProductIntegration(
			productId: string,
			productSku: string
		): Promise<IEcommerceProductIntegration[]> {
			try {
				const result = await this.find({
					where: { productId, productSku }
				});

				return result;
			} catch (error) {
				throw new Errors.MoleculerError(error.message, 100);
			}
		},

		async GetEcommerceProductSuccessIntegration(): Promise<
			IEcommerceProductIntegration[]
		> {
			try {
				const result = await this.find({
					where: { status: statusEcommerceIntegration.success }
				});

				return result;
			} catch (error) {
				throw new Errors.MoleculerError(error.message, 100);
			}
		},

		async PostEcommerceProductIntegration(
			message: IEcommerceProductIntegration
		) {
			try {
				const postMessage = await this.createQueryBuilder()
					.insert()
					.into(EcommerceProductsEntity)
					.values(message)
					.execute();

				return postMessage;
			} catch (error) {
				return error;
			}
		},

		async PutEcommerceProductIntegration(
			message: IEcommerceProductIntegration,
			id: number
		) {
			try {
				const putMessage = await this.createQueryBuilder()
					.update(EcommerceProductsEntity)
					.set({
						productId: message.productId,
						productSku: message.productSku,
						nameProduct: message.nameProduct,
						IPI: message.IPI,
						originProduct: message.originProduct,
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
