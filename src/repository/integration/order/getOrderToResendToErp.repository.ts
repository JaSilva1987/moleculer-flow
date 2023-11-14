import { Errors } from 'moleculer';
import { connectionIntegrador } from '../../../data-source';
import { IViewLogFlowIntegration } from '../../../interface/integration/configLog/viewLogIntegration.interface';
import { VWLogFlowResendDataEntity } from '../../../entity/integration/vwLogFlowResendData.entity';

export const GetOrderToResendToErpRepository = connectionIntegrador
	.getRepository(VWLogFlowResendDataEntity)
	.extend({
		async GetDataViewLogFlowIntegration(): Promise<
			IViewLogFlowIntegration[]
		> {
			try {
				const result = await this.find();

				return result;
			} catch (error) {
				throw new Errors.MoleculerError(error.message, error.code);
			}
		}
	});
