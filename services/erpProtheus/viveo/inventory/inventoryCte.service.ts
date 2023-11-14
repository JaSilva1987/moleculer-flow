('use strict');

import { Errors, Service as MoleculerService, ServiceBroker } from 'moleculer';
import { Event, Service } from 'moleculer-decorators';
import { IProtheusSend } from '../../../../src/interface/cte/documents/documentsCte.interface';
import { IGetToken } from '../../../../src/interface/erpProtheus/global';
import { AxiosRequest } from '../../../library/axios';
import { getTokenUrlGlobal } from '../../../library/erpProtheus';

@Service({
	name: 'cte.erpprotheusviveo.inventory',
	group: 'flow-cte'
})
export default class DocumentsCteService extends MoleculerService {
	indexName = 'flow-cte';
	isCode = '200';
	originLayer = 'erpprotheusviveo';
	serviceName = 'InventoryCteService';

	public constructor(public broker: ServiceBroker) {
		super(broker);
	}

	@Event({
		name: 'cte.erpprotheusviveo.get.inventory',
		group: 'flow-cte'
	})
	public async GetInventoryCte(cteProtheusSend: IProtheusSend) {
		try {
			const generateToken: IGetToken = await getTokenUrlGlobal(
				process.env.PROTHEUSVIVEO_CTE_BASEURL +
					process.env.PROTHEUSVIVEO_PASS_CTE
			);
			if (generateToken.access_token) {
				const confProtheus = {
					method: 'get',
					maxBodyLength: Infinity,
					url:
						process.env.PROTHEUSVIVEO_CTE_BASEURL +
						process.env.PROTHEUSVIVEO_CTE_INVENTORY,
					headers: {
						Authorization: 'Bearer ' + generateToken.access_token
					}
				};
				const returnProtheus = AxiosRequest(confProtheus);
				return returnProtheus;
			}
		} catch (error) {
			throw new Errors.MoleculerRetryableError(error.message, error.code);
		}
	}
}
