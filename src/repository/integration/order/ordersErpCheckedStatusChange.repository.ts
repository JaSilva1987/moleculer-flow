import { updatesErpCheckedStatusChangeEntity } from '../../../entity/integration/updatesErpCheckedStatusChange.entity';
import { IOrderStatusChenge } from '../../../interface/integration/order/orderStatusChenge.interface';
import { connectionIntegrador } from '../../../data-source';
import { Errors } from 'moleculer';

export const OrdersErpCheckedStatusChangeRepository = connectionIntegrador
	.getRepository(updatesErpCheckedStatusChangeEntity)
	.extend({
		async PostErpCheckedStatusChange(postMessage: IOrderStatusChenge) {
			try {
				const postOrder = await this.createQueryBuilder()
					.insert()
					.into(updatesErpCheckedStatusChangeEntity)
					.values(postMessage)
					.execute();

				return postOrder;
			} catch (error) {
				throw new Errors.MoleculerRetryableError(error.message, 100);
			}
		}
	});
