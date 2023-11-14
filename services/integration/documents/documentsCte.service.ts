('use strict');

import { Service as MoleculerService, ServiceBroker } from 'moleculer';
import { Event, Service } from 'moleculer-decorators';
import DocumentsCteBusinessRule from '../../../src/controller/cte/documents/documentsCte.controller';
import {
	IDocumentsCteGet,
	IDocumentsCtePostOne,
	IDocumentsCtePostTwo,
	IDocumentsCteReturn
} from '../../../src/interface/cte/documents/documentsCte.interface';
import { apmElasticConnect, loggerElastic } from '../../library/elasticSearch';

@Service({
	name: 'cte.integration',
	group: 'flow-cte'
})
export default class DocumentsCteService extends MoleculerService {
	indexName = 'flow-cte';
	isCode = '200';
	errCode = '499';
	originLayer = 'integration';
	serviceNamePost = 'DocumentsCteServicePost';
	serviceNameGet = 'DocumentsCteServiceGet';
	serviceNameSchedule = 'DocumentsCteServiceSchedule';
	responseReturn: any | IDocumentsCteReturn;
	resquestReturn: any | IDocumentsCteReturn;

	public constructor(public broker: ServiceBroker) {
		super(broker);
	}

	@Event({
		name: 'cte.integration.post',
		group: 'flow-cte'
	})
	public async CtePost(
		cteMessage: IDocumentsCtePostOne | IDocumentsCtePostTwo
	) {
		try {
			const cteController = new DocumentsCteBusinessRule();
			const validRule: any = await cteController.CtePost(cteMessage);
			if (validRule.code != '401') {
				this.resquestReturn = await this.broker.emit(
					'cte.erpprotheusviveo.post',
					validRule
				);

				this.resquestReturn.forEach((cteReturn: object) => {
					this.responseReturn = cteReturn;
				});
			} else {
				this.responseReturn = validRule;
			}

			loggerElastic(
				this.indexName,
				this.isCode,
				this.originLayer,
				this.serviceNamePost,
				JSON.stringify(cteMessage),
				JSON.stringify(this.resquestReturn)
			);

			return this.responseReturn;
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
		name: 'cte.integration.get',
		group: 'flow-cte'
	})
	public async CteGet(cteMessage: IDocumentsCteGet) {
		try {
			const cteController = new DocumentsCteBusinessRule();
			const validRule: any = await cteController.CteGet(cteMessage);
			if (validRule.code != '401') {
				this.resquestReturn = await this.broker.emit(
					'cte.erpprotheusviveo.get',
					validRule
				);

				this.resquestReturn.forEach((cteReturn: object) => {
					this.responseReturn = cteReturn;
				});
			} else {
				this.responseReturn = validRule;
			}

			loggerElastic(
				this.indexName,
				this.isCode,
				this.originLayer,
				this.serviceNameGet,
				JSON.stringify(cteMessage),
				JSON.stringify(this.resquestReturn)
			);

			return this.responseReturn;
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

	@Event({
		name: 'cte.integration.schedule',
		group: 'flow-cte'
	})
	public async CteSchedule(cteMessage: any) {
		if (cteMessage === 'true') {
			try {
				const cteController = new DocumentsCteBusinessRule();
				const validRule: any = await cteController.CteSchedule(
					cteMessage
				);
				if (validRule.code != '401') {
					this.resquestReturn = await this.broker.emit(
						'cte.erpprotheusviveo.get',
						validRule
					);

					this.resquestReturn.forEach((cteReturn: object) => {
						this.responseReturn = cteReturn;
					});
				} else {
					this.responseReturn = {
						total: 0
					};
				}

				if (this.responseReturn.total > 0) {
					await this.broker.emit(
						'cte.healthlog.schedule',
						this.responseReturn
					);
				}

				loggerElastic(
					this.indexName,
					this.isCode,
					this.originLayer,
					this.serviceNameSchedule,
					JSON.stringify(cteMessage),
					JSON.stringify(this.resquestReturn)
				);
			} catch (error) {
				loggerElastic(
					this.indexName,
					this.errCode,
					this.originLayer,
					this.serviceNameSchedule,
					JSON.stringify(cteMessage),
					JSON.stringify(error.message)
				);
				apmElasticConnect.captureError(new Error(error.message));
			}
		}
	}
}
