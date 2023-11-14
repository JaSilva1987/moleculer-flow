import { Errors } from 'moleculer';
import { connectionIntegrador } from '../../../data-source';
import { EcommerceInvoiceEntity } from '../../../entity/integration/invoiceEcommerce.entity';
import { IDataInvoiceOrder } from '../../../interface/integration/invoice/invoice.interface';

export const EcommerceInvoiceIntegrationRepository = connectionIntegrador
	.getRepository(EcommerceInvoiceEntity)
	.extend({
		async GetEcommerceInvoiceIntegration(
			idOrder: string,
			numberInvoice: string
		): Promise<IDataInvoiceOrder[]> {
			try {
				const result = await this.find({
					where: { idOrder, numberInvoice }
				});

				return result;
			} catch (error) {
				throw new Errors.MoleculerError(error.message, 100);
			}
		},

		async GetEcommerceInvoiceIntegrationError(): Promise<
			IDataInvoiceOrder[]
		> {
			try {
				const result = await this.createQueryBuilder(
					new EcommerceInvoiceEntity()
				)
					.select()
					.where('status <> :status', { status: 'success' })
					.getRawMany();

				return result;
			} catch (error) {
				throw new Errors.MoleculerError(error.message, 100);
			}
		},

		async PostEcommerceInvoiceIntegration(message: IDataInvoiceOrder) {
			try {
				const postMessage = await this.createQueryBuilder()
					.insert()
					.into(EcommerceInvoiceEntity)
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

		async PutEcommerceInvoiceIntegration(
			message: IDataInvoiceOrder,
			id: number
		) {
			try {
				const putMessage = await this.createQueryBuilder()
					.update(EcommerceInvoiceEntity)
					.set({
						numberInvoice: message.numberInvoice,
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
