('use strict');

import { Service as MoleculerService, ServiceBroker } from 'moleculer';
import { Event, Service } from 'moleculer-decorators';
import { TreatmentCte } from '../../../../src/enum/cte/enum';
import {
	IDocumentsCteReturn,
	IProtheusSend
} from '../../../../src/interface/cte/documents/documentsCte.interface';
import { axiosInterceptors } from '../../../library/axios/axiosInterceptos';
import {
	apmElasticConnect,
	loggerElastic
} from '../../../library/elasticSearch';

@Service({
	name: 'cte.erpprotheusviveo',
	group: 'flow-cte'
})
export default class DocumentsCteService extends MoleculerService {
	indexName = 'flow-cte';
	isCode = '200';
	errCode = '499';
	originLayer = 'erpprotheusviveo';
	serviceNamePost = 'DocumentsCteServicePost';
	serviceNameGet = 'DocumentsCteServiceGet';

	public constructor(public broker: ServiceBroker) {
		super(broker);
	}

	@Event({
		name: 'cte.erpprotheusviveo.post',
		group: 'flow-cte'
	})
	public async CtePost(cteMessage: IProtheusSend) {
		try {
			const returnProtheus: IDocumentsCteReturn = await axiosInterceptors(
				cteMessage
			);

			loggerElastic(
				this.indexName,
				this.isCode,
				this.originLayer,
				this.serviceNamePost,
				JSON.stringify(cteMessage),
				JSON.stringify(returnProtheus)
			);

			if (
				Number(returnProtheus.code) === 200 ||
				Number(returnProtheus.code) === 201 ||
				returnProtheus.status === 200 ||
				returnProtheus.status === 201
			) {
				return returnProtheus;
			} else {
				return {
					code:
						returnProtheus.status != undefined
							? returnProtheus.status
							: returnProtheus.code,
					message: returnProtheus.message,
					detailedMessage:
						returnProtheus.detailedMessage != undefined
							? returnProtheus.detailedMessage
							: TreatmentCte.noDetailsErr
				};
			}
		} catch (error) {
			loggerElastic(
				this.indexName,
				this.errCode,
				this.originLayer,
				this.serviceNamePost,
				JSON.stringify(cteMessage),
				JSON.stringify(error.message)
			);
			apmElasticConnect.captureError(new Error(error.message));
		}
	}

	@Event({
		name: 'cte.erpprotheusviveo.get',
		group: 'flow-cte'
	})
	public async CteGet(cteMessage: IProtheusSend) {
		try {
			const returnProtheus: IDocumentsCteReturn = await axiosInterceptors(
				cteMessage
			);

			loggerElastic(
				this.indexName,
				this.isCode,
				this.originLayer,
				this.serviceNameGet,
				JSON.stringify(cteMessage),
				JSON.stringify(returnProtheus)
			);

			if (returnProtheus.total > 0) {
				return returnProtheus;
			} else {
				return {
					code:
						returnProtheus.status != undefined
							? returnProtheus.status
							: returnProtheus.code,
					message: returnProtheus.message,
					detailedMessage:
						returnProtheus.detailedMessage != undefined
							? returnProtheus.detailedMessage
							: TreatmentCte.noDetailsErr
				};
			}
		} catch (error) {
			loggerElastic(
				this.indexName,
				this.errCode,
				this.originLayer,
				this.serviceNameGet,
				JSON.stringify(cteMessage),
				JSON.stringify(error.message)
			);
			apmElasticConnect.captureError(new Error(error.message));
		}
	}
}
