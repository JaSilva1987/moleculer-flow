('use strict');

import {
	Context,
	Errors,
	Service as MoleculerService,
	ServiceBroker
} from 'moleculer';
import { connectionIntegrador } from '../../../src/data-source';
import { InvoiceExpedLog } from '../../../src/entity/integration/invoiceExpedLog.entity';
import {
	StatusCodeExpedLog,
	TreatmentExpedLog
} from '../../../src/enum/expedLog/enum';

import { IExpedLogReturn } from '../../../src/interface/expedLog/expedLog.interface';
import { IFetchInvoiceExpedLogReturn } from '../../../src/interface/expedLog/invoiceExpedLog.interface';
import { validatorFactory } from '../../../src/validator/cte/validator';
import {
	FetchInvoiceExpedLogSchema,
	fetchInvoiceExpedLogSchemaType
} from '../../../src/validator/expedLog/invoice/invoiceExpedLog.validator';
import { loggerElastic } from '../../library/elasticSearch';

export default class FetchInvoiceExpedLog extends MoleculerService {
	indexName = 'flow-expedlog';
	isCode = '200';
	errCode = '499';
	originLayer = 'expedlog';
	serviceNamePost = 'StoreInvoiceDataServicePost';
	serviceNameGet = 'FetchInvoiceServiceGet';
	serviceNameScheduler = 'FetchInvoiceServiceScheduler';
	responseReturn: IFetchInvoiceExpedLogReturn | IExpedLogReturn | any;
	responseApi: IFetchInvoiceExpedLogReturn | IExpedLogReturn | any;

	public constructor(broker: ServiceBroker) {
		super(broker);

		this.parseServiceSchema({
			name: 'expedlog-fetch-invoice',
			group: 'flow-expedlog',
			actions: {
				post: {
					cache: false,
					rest: {
						method: 'POST',
						basePath: 'expedlog/',
						path: 'fetch-invoice/'
					},
					async handler(
						expedLogCtx: Context<IFetchInvoiceExpedLogReturn>
					): Promise<IExpedLogReturn> {
						return await this.StoreInvoiceData(expedLogCtx);
					}
				}
			}
		});
	}

	public async StoreInvoiceData(expedLogCtx: Context<any>) {
		try {
			const expedLogParams = Object.values(expedLogCtx.params);

			if (!Array.isArray(expedLogParams))
				throw {
					status: StatusCodeExpedLog.validationJson,
					message: `${TreatmentExpedLog.inconsistency} - ${TreatmentExpedLog.arrayExpected}`,
					detailedMessage: TreatmentExpedLog.arrayExpected
				};

			const validation = validatorFactory<fetchInvoiceExpedLogSchemaType>(
				FetchInvoiceExpedLogSchema
			);

			loggerElastic(
				this.indexName,
				this.isCode,
				this.originLayer,
				this.serviceNamePost,
				JSON.stringify(expedLogParams),
				JSON.stringify('')
			);

			expedLogParams.forEach((expedLog: any) => {
				const bodyReceived = expedLog as fetchInvoiceExpedLogSchemaType;
				const validateJson = validation.verify(bodyReceived);
				if (!validateJson)
					throw {
						code: StatusCodeExpedLog.validationJson,
						message: `${TreatmentExpedLog.inconsistency} - ${TreatmentExpedLog.jsonFormat}`,
						detailedMessage: TreatmentExpedLog.jsonFormat
					};
			});

			expedLogParams.forEach(
				async (expedLog: IFetchInvoiceExpedLogReturn) => {
					const invoiceSaveObj = {
						receivedBody: JSON.stringify(expedLog),
						companyIdentifier: expedLog.cnpjEmpresa
					};
					const invoiceSaved = await connectionIntegrador
						.getRepository(InvoiceExpedLog)
						.save(invoiceSaveObj);
					if (!invoiceSaved)
						throw {
							status: StatusCodeExpedLog.databaseError,
							message: TreatmentExpedLog.inconsistency,
							detailedMessage: TreatmentExpedLog.databaseError
						};
				}
			);

			return await Promise.resolve({
				status: +StatusCodeExpedLog.success,
				message: TreatmentExpedLog.success,
				detailedMessage: TreatmentExpedLog.invoiceDataReceived
			});
		} catch (error) {
			return await Promise.reject(
				new Errors.MoleculerError(
					error.message || error.detailedMessage || error,
					+error.code || +error.status || 400
				)
			);
		}
	}
}
