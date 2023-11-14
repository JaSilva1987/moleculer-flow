import { AxiosError } from 'axios';
import { AxiosRequest } from '../../../services/library/axios';
import { loggerElastic } from '../../../services/library/elasticSearch';
import { ICompanyConfigExpedLog } from '../../interface/expedLog/company.interface';
import {
	IDynamicIdentifierExpedLog,
	IDynamicTokenExpedLog,
	IExpedLogObjPost,
	ITokenExpedLog
} from '../../interface/expedLog/expedLog.interface';
import { IGetToken } from '../../interface/erpProtheus/global';
import { getTokenUrlGlobal } from '../../../services/library/erpProtheus/getToken';

export default class ExpedLogRequests {
	indexName = 'flow-expedlog';
	isCode = '200';
	errCode = '499';
	originLayer = 'controller';
	serviceName = 'ExpedLogControllerRequest';
	configToken: object;
	companyConfig: Array<ICompanyConfigExpedLog> = [
		{
			companyIdentifier: process.env.EXPEDLOG_EXPRESSA_COMPANY_IDENTIFIER,
			username: process.env.EXPEDLOG_EXPRESSA_AUTH_USERNAME,
			password: process.env.EXPEDLOG_EXPRESSA_AUTH_PASSWORD,
			baseProtheus: process.env.PROTHEUS_EXPRESSA_EXPEDLOG_BASE_URL
		},
		{
			companyIdentifier: process.env.EXPEDLOG_MAFRA_COMPANY_IDENTIFIER,
			username: process.env.EXPEDLOG_MAFRA_AUTH_USERNAME,
			password: process.env.EXPEDLOG_MAFRA_AUTH_PASSWORD,
			baseProtheus: process.env.PROTHEUS_MAFRA_EXPEDLOG_BASE_URL
		},
		{
			companyIdentifier: process.env.EXPEDLOG_CREMER_COMPANY_IDENTIFIER,
			username: process.env.EXPEDLOG_CREMER_AUTH_USERNAME,
			password: process.env.EXPEDLOG_CREMER_AUTH_PASSWORD,
			baseProtheus: process.env.PROTHEUS_CREMER_EXPEDLOG_BASE_URL
		}
	];

	public async ExpedLogRequestsToken(objToken: IDynamicTokenExpedLog) {
		try {
			const config: ICompanyConfigExpedLog = this.companyConfig.find(
				(company) =>
					objToken.cnpjFilial.includes(company.companyIdentifier)
			);
			if (config) {
				this.configToken = {
					method: 'POST',
					maxBodyLength: Infinity,
					url:
						process.env.EXPEDLOG_BASE_URL +
						process.env.EXPEDLOG_TOKEN_URL,
					headers: {
						'Content-Type': process.env.CONTENT_TYPE
					},
					data: JSON.stringify({
						grant_type: process.env.EXPEDLOG_TOKEN_GRANT_TYPE,
						username: config.username,
						password: config.password
					})
				};
			} else {
				return {
					code: 401,
					message: 'CNPJ empresa não autorizado'
				};
			}


			const requestSend = await AxiosRequest(this.configToken);
			const responseReturn = requestSend.message;

			loggerElastic(
				this.indexName,
				this.isCode,
				this.originLayer,
				this.serviceName,
				JSON.stringify(this.configToken),
				JSON.stringify(requestSend)
			);

			return responseReturn as unknown as ITokenExpedLog;
		} catch (error) {
			loggerElastic(
				this.indexName,
				this.errCode,
				this.originLayer,
				this.serviceName,
				JSON.stringify(this.configToken),
				JSON.stringify(error.message)
			);
			return error;
		}
	}

	public async ExpedLogRequests(
		expedLogMessage: IDynamicIdentifierExpedLog,
		token: string,
		url: string
	) {
		try {
			const configReqObj: IExpedLogObjPost = {
				method: 'post',
				maxBodyLength: Infinity,
				headers: {
					Authorization: 'Bearer ' + token,
					'Content-Type': process.env.CONTENT_TYPE
				},
				data: expedLogMessage
			};

			const config: ICompanyConfigExpedLog = this.companyConfig.find(
				(company) =>
					expedLogMessage.cnpjFilial.includes(
						company.companyIdentifier
					)
			);

			if (!config)
				return { code: 401, message: 'CNPJ empresa não autorizado' };

			Object.assign(configReqObj, {
				url: process.env.EXPEDLOG_BASE_URL + url
			});


			const requestSend = await AxiosRequest(configReqObj);

			if ((requestSend.message as unknown) instanceof AxiosError) {
				const error = requestSend.message as unknown as AxiosError;
				requestSend.message = error.response.data as string;
				requestSend.status = error.response.status;
			}

			loggerElastic(
				this.indexName,
				this.isCode,
				this.originLayer,
				this.serviceName,
				JSON.stringify(this.configToken),
				JSON.stringify(requestSend)
			);

			return requestSend;
		} catch (error) {
			loggerElastic(
				this.indexName,
				this.errCode,
				this.originLayer,
				this.serviceName,
				JSON.stringify(this.configToken),
				JSON.stringify(error.message)
			);
			return error;
		}
	}

	public async ProtheusExpedLogRequests(
		expedLogMessage: IDynamicIdentifierExpedLog,
		url: string
	) {
		try {
			const configReqObj: IExpedLogObjPost = {
				method: 'post',
				maxBodyLength: Infinity,
				headers: {
					'Content-Type': process.env.CONTENT_TYPE
				},
				data: expedLogMessage
			};

			const config: ICompanyConfigExpedLog = this.companyConfig.find(
				(company) =>
					expedLogMessage.cnpjFilial.includes(
						company.companyIdentifier
					)
			);

			if (!config)
				return {
					code: 401,
					message: 'CNPJ empresa protheus não autorizado'
				};

			const generateTokenProtheus =
				config.baseProtheus ==
					process.env.PROTHEUS_CREMER_EXPEDLOG_BASE_URL ||
				config.baseProtheus ==
					process.env.PROTHEUS_MAFRA_EXPEDLOG_BASE_URL;

			if (generateTokenProtheus) {
				const protheusAuthorization: IGetToken =
					await getTokenUrlGlobal(
						config.baseProtheus +
							process.env.PROTHEUS_EXPEDLOG_TOKEN_URL
					);
				if (protheusAuthorization?.access_token) {
					Object.assign(configReqObj, {
						headers: {
							Authorization:
								'Bearer ' + protheusAuthorization.access_token,
							'Content-Type': process.env.CONTENT_TYPE
						}
					});
				}
			}

			Object.assign(configReqObj, {
				url:
					config.baseProtheus +
					url
			});

			const requestSend = await AxiosRequest(configReqObj);

			loggerElastic(
				this.indexName,
				this.isCode,
				this.originLayer,
				this.serviceName,
				JSON.stringify(this.configToken),
				JSON.stringify(requestSend)
			);

			return requestSend.message;
		} catch (error) {
			loggerElastic(
				this.indexName,
				this.errCode,
				this.originLayer,
				this.serviceName,
				JSON.stringify(this.configToken),
				JSON.stringify(error.message)
			);
			return error;
		}
	}
}
