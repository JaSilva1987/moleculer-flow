import { Errors } from 'moleculer';
import { connectionIntegrador } from '../../../data-source';
import { EcommerceOrderRequestEntity } from '../../../entity/integration/orderRequestEcommerce.entity';
import { IOrderRequestEcommerceIntegration } from '../../../interface/integration/order/orderRequestEcommerce.interface';
import { Between, Not } from 'typeorm';

export const EcommerceOrderRequestIntegrationRepository = connectionIntegrador
	.getRepository(EcommerceOrderRequestEntity)
	.extend({
		async GetEcommerceOrderRequestIntegrationError(): Promise<
			IOrderRequestEcommerceIntegration[]
		> {
			try {
				const result = await this.find({
					where: {
						status: Not('success')
					}
				});

				return result;
			} catch (error) {
				throw new Errors.MoleculerError(error.message, 100);
			}
		},

		async GetEcommerceOrderRequestIntegrationSuccess(
			startDate: string,
			endDate: string,
			status: string
		): Promise<IOrderRequestEcommerceIntegration[]> {
			try {
				const result = await this.find({
					where: {
						createdAt: Between(
							new Date(startDate),
							new Date(endDate)
						),
						status: status
					}
				});

				return result;
			} catch (error) {
				throw new Errors.MoleculerError(error.message, 100);
			}
		},

		async GetEcommerceOrderRequestIntegration(
			idOrder: string
		): Promise<IOrderRequestEcommerceIntegration[]> {
			try {
				const result = await this.find({
					where: { idOrder }
				});

				return result;
			} catch (error) {
				throw new Errors.MoleculerError(error.message, 100);
			}
		},

		async PostEcommerceOrderRequestIntegration(
			message: IOrderRequestEcommerceIntegration
		) {
			try {
				const postMessage = await this.createQueryBuilder()
					.insert()
					.into(EcommerceOrderRequestEntity)
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

		async PutEcommerceOrderRequestIntegration(
			message: IOrderRequestEcommerceIntegration,
			id: number
		) {
			try {
				const putMessage = await this.createQueryBuilder()
					.update(EcommerceOrderRequestEntity)
					.set({
						idOrder: message.idOrder,
						JSON: message.JSON,
						JSONRetorno: message.JSONRetorno,
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
