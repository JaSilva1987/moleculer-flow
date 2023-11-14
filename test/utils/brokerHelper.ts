//#region Global Imports
import { ServiceBroker } from 'moleculer';
//#endregion Global Imports

/* eslint-disable */
//#region Local Imports
import postRequestToGko from '../../services/gko/dne/postRequest.service';
//#endregion Local Imports
/* eslint-enable */

export namespace BrokerHelper {
	export const setupBroker = () => {
		const broker = new ServiceBroker({ logger: false });

		broker.createService(postRequestToGko);

		return broker;
	};
}
