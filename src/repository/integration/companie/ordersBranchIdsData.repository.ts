import { Errors } from 'moleculer';
import { connectionIntegrador } from '../../../data-source';
import { VWOrdersBranchIdsDataEntity } from '../../../entity/integration/vwOrdersBranchIdsData.entity';

export const ordersBranchIdsDataRepository = connectionIntegrador
	.getRepository(VWOrdersBranchIdsDataEntity)
	.extend({
		async GetAll() {
			try {
				const ordersBranchIdData = await this.createQueryBuilder(
					'VWOrdersBranchIdsDataEntity'
				)
					.select([])
					.orderBy('data', 'ASC')
					.addOrderBy('hora', 'ASC')
					.getRawMany();

				if (ordersBranchIdData.length > 0) {
					return ordersBranchIdData;
				} else {
					throw new Error(
						'There are no purchase orders branchIds under these conditions!'
					);
				}
			} catch (error) {
				throw new Errors.MoleculerError(error.message, error.code);
			}
		}
	});
