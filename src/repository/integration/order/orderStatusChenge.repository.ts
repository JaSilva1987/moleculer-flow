import { Errors } from 'moleculer';
import { connectionIntegrador } from '../../../data-source';
import { SubsidiaryFlowEntity } from '../../../entity/integration/subsidiaryFlow.entity';

export const StatusChengeRepository = connectionIntegrador
	.getRepository(SubsidiaryFlowEntity)
	.extend({
		async checkStatus() {
			try {
				const integrador = 1;

				const statusFlow = await this.find({ where: { integrador } });

				return statusFlow;
			} catch (error) {
				throw new Errors.MoleculerRetryableError(error.message, 100);
			}
		}
	});
