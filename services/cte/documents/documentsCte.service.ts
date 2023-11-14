('use strict');

import { CronJob } from 'cron';
import {
	Context,
	Errors,
	Service as MoleculerService,
	ServiceBroker
} from 'moleculer';
import { StatusCodeCte, TreatmentCte } from '../../../src/enum/cte/enum';
import {
	IDocumentsCteGet,
	IDocumentsCtePostOne,
	IDocumentsCtePostTwo,
	IDocumentsCteReturn
} from '../../../src/interface/cte/documents/documentsCte.interface';
import {
	documentsOneCteSchema,
	documentsOneCteSchemaType,
	documentsTwoCteSchema
} from '../../../src/validator/cte/documents/documentsCte.validator';
import { validatorFactory } from '../../../src/validator/cte/validator';
import { loggerElastic } from '../../library/elasticSearch';

export default class DocumentsCteService extends MoleculerService {
	indexName = 'flow-cte';
	isCode = '200';
	errCode = '499';
	originLayer = 'cte';
	serviceNamePost = 'DocumentsCteServicePost';
	serviceNameGet = 'DocumentsCteServiceGet';
	responseReturn: any | IDocumentsCteReturn;
	responseApi: any | object;

	public constructor(public broker: ServiceBroker) {
		super(broker);

		this.cronJob = new CronJob(process.env.CTE_DOCUMENTS_CRON, async () => {
			try {
				this.broker.broadcast(
					'cte.integration.schedule',
					process.env.CTE_ATIVE
				);
			} catch {
				new Error('Cron not run');
			}
		});

		if (!this.cronJob.running) this.cronJob.start();

		this.parseServiceSchema({
			name: 'cte-documents',
			group: 'flow-cte',
			actions: {
				post: {
					cache: false,
					rest: {
						method: 'POST',
						basePath: 'cte/',
						path: 'documents/'
					},
					async handler(cteMessage: Context<object>): Promise<
						| IDocumentsCtePostOne //Dados
						| IDocumentsCtePostTwo //Ct-e NF-e
					> {
						return await this.CtePost(cteMessage);
					}
				},
				get: {
					cache: false,
					rest: {
						method: 'GET',
						basePath: 'cte/',
						path: 'documents/'
					},
					querystring: {},
					async handler(
						ctxMessage: Context<object>
					): Promise<IDocumentsCteGet> {
						return await this.CteGet(ctxMessage);
					}
				}
			}
		});
	}

	public async CtePost(
		cteMessage: Context<IDocumentsCtePostOne | IDocumentsCtePostTwo>
	) {
		const cteParams = cteMessage.params;
		const metaHeaders = Object(cteMessage.meta);
		const orderValidation = validatorFactory<documentsOneCteSchemaType>(
			documentsOneCteSchema
		);
		const bodyRecived = cteParams as documentsOneCteSchemaType;
		const validateJson = orderValidation.verify(bodyRecived);

		if (Boolean(validateJson) === true) {
			Object.assign(cteParams, {
				meta: metaHeaders.tenantid
			});

			this.responseApi = await this.broker.emit(
				'cte.integration.post',
				cteParams
			);

			this.responseApi.forEach((cteReturn: object) => {
				this.responseReturn = cteReturn;
			});
		} else {
			const orderValidation = validatorFactory<documentsOneCteSchemaType>(
				documentsTwoCteSchema
			);
			const bodyRecived = cteParams as documentsOneCteSchemaType;
			const validateJson = orderValidation.verify(bodyRecived);

			if (Boolean(validateJson) === true) {
				Object.assign(cteParams, {
					meta: metaHeaders.tenantId
				});

				this.responseApi = await this.broker.emit(
					'cte.integration.post',
					cteParams
				);

				this.responseApi.forEach((cteReturn: object) => {
					this.responseReturn = cteReturn;
				});
			} else {
				this.responseReturn = {
					code: StatusCodeCte.validationJson,
					message: TreatmentCte.inconsistency,
					detailedMessage: TreatmentCte.jsonFormat
				};
			}
		}

		const validReturn: IDocumentsCteReturn = this.responseReturn;

		loggerElastic(
			this.indexName,
			this.isCode,
			this.originLayer,
			this.serviceNamePost,
			JSON.stringify(cteMessage.params),
			JSON.stringify(validReturn)
		);

		if (
			Number(validReturn.code) === 200 ||
			Number(validReturn.code) === 201 ||
			validReturn.status === 200 ||
			validReturn.status === 201
		) {
			return await Promise.resolve(validReturn);
		} else if (
			validReturn.detailedMessage === TreatmentCte.noDetailsErr &&
			validReturn.code === undefined
		) {
			return await Promise.reject(
				new Errors.MoleculerError(
					JSON.parse(JSON.stringify(TreatmentCte.timeOutProtheus)),
					504,
					JSON.parse(JSON.stringify(TreatmentCte.timeOut))
				)
			);
		} else if (typeof validReturn === 'undefined') {
			return await Promise.reject(
				new Errors.MoleculerError(
					JSON.parse(JSON.stringify(TreatmentCte.noDetailsErr)),
					500,
					JSON.parse(JSON.stringify(TreatmentCte.protheusOut))
				)
			);
		} else {
			return await Promise.reject(
				new Errors.MoleculerError(
					JSON.parse(JSON.stringify(validReturn.detailedMessage)),
					validReturn.code != undefined &&
					typeof 'string' &&
					typeof 'number'
						? validReturn.code != undefined
							? Number(validReturn.code)
							: validReturn.status
						: 400,
					JSON.parse(JSON.stringify(validReturn.message))
				)
			);
		}
	}

	public async CteGet(cteMessage: Context<IDocumentsCteGet>) {
		const cteParams = cteMessage.params;
		const metaHeaders = Object(cteMessage.meta);

		Object.assign(cteParams, {
			meta: metaHeaders.tenantId
		});

		this.responseApi = await this.broker.emit(
			'cte.integration.get',
			cteParams
		);

		this.responseApi.forEach((cteReturn: object) => {
			this.responseReturn = cteReturn;
		});

		const validReturn: IDocumentsCteReturn = this.responseReturn;

		loggerElastic(
			this.indexName,
			this.isCode,
			this.originLayer,
			this.serviceNameGet,
			JSON.stringify(cteMessage.params),
			JSON.stringify(validReturn)
		);

		if (
			Number(validReturn.code) === 200 ||
			Number(validReturn.code) === 201 ||
			validReturn.status === 200 ||
			validReturn.status === 201
		) {
			return await Promise.resolve(validReturn);
		} else if (
			validReturn.detailedMessage === TreatmentCte.noDetailsErr &&
			validReturn.code === undefined
		) {
			return await Promise.reject(
				new Errors.MoleculerError(
					JSON.parse(JSON.stringify(TreatmentCte.timeOutProtheus)),
					504,
					JSON.parse(JSON.stringify(TreatmentCte.timeOut))
				)
			);
		} else if (typeof validReturn === 'undefined') {
			return await Promise.reject(
				new Errors.MoleculerError(
					JSON.parse(JSON.stringify(TreatmentCte.noDetailsErr)),
					500,
					JSON.parse(JSON.stringify(TreatmentCte.protheusOut))
				)
			);
		} else {
			return await Promise.reject(
				new Errors.MoleculerError(
					JSON.parse(JSON.stringify(validReturn.detailedMessage)),
					validReturn.code != undefined &&
					typeof 'string' &&
					typeof 'number'
						? validReturn.code != undefined
							? Number(validReturn.code)
							: validReturn.status
						: 400,
					JSON.parse(JSON.stringify(validReturn.message))
				)
			);
		}
	}
}
