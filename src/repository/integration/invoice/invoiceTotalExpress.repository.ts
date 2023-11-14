import { Errors } from 'moleculer';
import { connectionIntegrador } from '../../../data-source';
import { InvoiceTotalExpressEntity } from '../../../entity/integration/invoiceTotalExpress.entity';
import { IDataInvoiceTotalExpress } from '../../../interface/integration/invoice/invoiceTotalExpress.interface';

export const InvoiceTotalExpressRepository = connectionIntegrador
	.getRepository(InvoiceTotalExpressEntity)
	.extend({
		async GetInvoiceTotalExpressIntegration(
			invoiceNumber: string
		): Promise<IDataInvoiceTotalExpress[]> {
			try {
				const result = await this.find({
					where: { invoiceNumber }
				});

				return result;
			} catch (error) {
				throw new Errors.MoleculerError(error.message, 100);
			}
		},

		async PostInvoiceTotalExpressIntegration(
			message: IDataInvoiceTotalExpress
		) {
			try {
				const postMessage = await this.createQueryBuilder()
					.insert()
					.into(InvoiceTotalExpressEntity)
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

		async PutInvoiceTotalExpressIntegration(
			message: IDataInvoiceTotalExpress,
			id: number
		) {
			try {
				const putMessage = await this.createQueryBuilder()
					.update(InvoiceTotalExpressEntity)
					.set({
						invoiceNumber: message.invoiceNumber,
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
