('use strict');

import {
	Context,
	Errors,
	Service as MoleculerService,
	ServiceBroker
} from 'moleculer';
import {
	StatusCodeExpedLog,
	TreatmentExpedLog
} from '../../../src/enum/expedLog/enum';
import { IResponseExpedLog } from '../../../src/interface/expedLog/expedLog.interface';
import {
	IInvoiceIntegrationExpedLog,
	IInvoiceIntegrationExpedLogReturn
} from '../../../src/interface/expedLog/invoiceExpedLog.interface';
import {
	InvoiceIntegrationExpedLogSchema,
	invoiceIntegrationExpedLogSchemaType
} from '../../../src/validator/expedLog/invoice/invoiceExpedLog.validator';
import { validatorFactory } from '../../../src/validator/validator';
import { loggerElastic } from '../../library/elasticSearch';

export default class InvoiceIntegrationExpedLog extends MoleculerService {
	indexName = 'flow-expedlog';
	isCode = '200';
	errCode = '499';
	originLayer = 'expedlog';
	serviceNamePost = 'InvoiceIntegrationServicePost';
	serviceNameGet = 'InvoiceIntegrationServiceGet';
	responseReturn: any | IResponseExpedLog;
	responseApi: any | IResponseExpedLog;

	public constructor(broker: ServiceBroker) {
		super(broker);

		this.parseServiceSchema({
			name: 'expedlog-invoice-integration',
			group: 'flow-expedlog',
			actions: {
				post: {
					cache: false,
					rest: {
						method: 'POST',
						basePath: 'expedlog/',
						path: 'invoice-integration/'
					},
					async handler(
						expedLogCtx: Context<IInvoiceIntegrationExpedLog>
					): Promise<IResponseExpedLog> {
						return await this.InvoiceIntegrationPost(expedLogCtx);
					}
				}
			}
		});
	}

	public async InvoiceIntegrationPost(
		expedLogCtx: Context<IInvoiceIntegrationExpedLog>
	) {
		const expedLogParams = expedLogCtx.params;
		const validation =
			validatorFactory<invoiceIntegrationExpedLogSchemaType>(
				InvoiceIntegrationExpedLogSchema
			);
		const bodyReceived =
			expedLogParams as invoiceIntegrationExpedLogSchemaType;
		const validateJson = validation.verify(bodyReceived);

		if (validateJson) {
			this.responseApi = await this.broker.emit(
				'expedlog.invoice-integration.post',
				expedLogParams
			);

			this.responseApi.forEach((expedLogReturn: object) => {
				this.responseReturn = expedLogReturn;
			});
		} else {
			this.responseReturn = {
				code: StatusCodeExpedLog.validationJson,
				message: TreatmentExpedLog.inconsistency,
				detailedMessage: TreatmentExpedLog.jsonFormat
			};
		}

		const validReturn: IInvoiceIntegrationExpedLogReturn =
			this.responseReturn;

		loggerElastic(
			this.indexName,
			this.isCode,
			this.originLayer,
			this.serviceNamePost,
			JSON.stringify(expedLogCtx.params),
			JSON.stringify(validReturn)
		);

		if (validReturn.status == 200) {
			return await Promise.resolve(validReturn);
		} else {
			return await Promise.reject(
				new Errors.MoleculerError(
					validReturn.message ||
						validReturn.detailedMessage ||
						String(validReturn),
					+validReturn.status || +validReturn.code || 400
				)
			);
		}
	}
}
