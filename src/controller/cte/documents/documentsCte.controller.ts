import { format, sub } from 'date-fns';
import {
	apmElasticConnect,
	loggerElastic
} from '../../../../services/library/elasticSearch';
import { getTokenUrlGlobal } from '../../../../services/library/erpProtheus';
import {
	CompaniesCNPJWebhook,
	CompaniesNameWebhook,
	StatusCodeCte,
	TreatmentCte
} from '../../../enum/cte/enum';
import {
	IDocumentsCteGet,
	IDocumentsCtePostOne,
	IDocumentsCtePostTwo,
	IDocumentsObjGet,
	IDocumentsObjPost,
	IProtheusSend,
	ISendWebHook
} from '../../../interface/cte/documents/documentsCte.interface';
import { IGetToken } from '../../../interface/erpProtheus/global';

export default class DocumentsCteBusinessRule {
	indexName = 'flow-cte';
	isCode = '200';
	errCode = '499';
	originLayer = 'controller';
	serviceNamePost = 'DocumentsCteServicePost';
	serviceNameGet = 'DocumentsCteServiceGet';
	serviceNameSchedule = 'DocumentsCteServiceSchedule';

	public async CtePost(
		cteMessage: IDocumentsCtePostOne | IDocumentsCtePostTwo
	) {
		try {
			for (let i = 0; i < cteMessage.data.length; i++) {
				const configObj: IDocumentsObjPost = {
					method: 'post',
					maxBodyLength: Infinity,
					url:
						process.env.PROTHEUSVIVEO_CTE_BASEURL +
						process.env.PROTHEUSVIVEO_CTE_DOCUMENTS,
					headers: {
						TenantID:
							cteMessage.meta !== undefined
								? cteMessage.meta
								: '04,001001',
						ForceAudit: 'true',
						ForceOptimize: 'true',
						ForceUseAdapter: 'false',
						'Content-Type': 'application/json'
					},
					data: { data: cteMessage.data }
				};

				const objSend: IProtheusSend = {
					objtRequest: configObj
				};

				loggerElastic(
					this.indexName,
					this.isCode,
					this.originLayer,
					this.serviceNameGet,
					JSON.stringify(cteMessage),
					JSON.stringify(objSend)
				);

				const generateToken: IGetToken = await getTokenUrlGlobal(
					process.env.PROTHEUSVIVEO_CTE_BASEURL +
						process.env.PROTHEUSVIVEO_PASS_CTE
				);
				if (generateToken.access_token) {
					Object.assign(configObj.headers, {
						Authorization: 'Bearer ' + generateToken.access_token
					});

					return objSend;
				} else {
					return {
						code: StatusCodeCte.noToken,
						message: TreatmentCte.noToken,
						detailedMessage: TreatmentCte.detailToken
					};
				}
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

	public async CteGet(cteMessage: IDocumentsCteGet) {
		try {
			const configObj: IDocumentsObjGet = {
				method: 'get',
				maxBodyLength: Infinity,
				url:
					process.env.PROTHEUSVIVEO_CTE_BASEURL +
					process.env.PROTHEUSVIVEO_CTE_DOCUMENTS,
				headers: {
					TenantID:
						cteMessage.meta !== undefined
							? cteMessage.meta
							: '04,001001',
					ForceAudit: 'true',
					ForceOptimize: 'true',
					ForceUseAdapter: 'false'
				},
				params: {}
			};

			const objSend: IProtheusSend = {
				objtRequest: configObj
			};

			let setFilters = '';

			if (cteMessage.pageNumber != undefined) {
				Object.assign(configObj.params, {
					Page: cteMessage.pageNumber
				});
			}

			if (cteMessage.pageNumber != undefined) {
				Object.assign(configObj.params, {
					PageSize: cteMessage.pageSize
				});
			}

			if (cteMessage.orderId != undefined) {
				Object.assign(configObj.params, {
					Order: cteMessage.orderId
				});
			}

			if (cteMessage.dateTimeUpdate != undefined) {
				setFilters += `dateTimeUpdate gt '${cteMessage.dateTimeUpdate}'`;
			}

			if (cteMessage.documentFederalKey != undefined) {
				if (setFilters.includes('dateTimeUpdate')) {
					setFilters += ` AND documentFederalKey=${cteMessage.documentFederalKey}`;
				} else {
					setFilters += `documentFederalKey=${cteMessage.documentFederalKey}`;
				}
			}

			if (cteMessage.senderFederalID != undefined) {
				if (
					setFilters.includes('dateTimeUpdate') ||
					setFilters.includes('documentFederalKey')
				) {
					setFilters += ` AND senderFederalID eq '${cteMessage.senderFederalID.replace(
						/\D/g,
						''
					)}'`;
				} else {
					setFilters += `senderFederalID eq '${cteMessage.senderFederalID.replace(
						/\D/g,
						''
					)}'`;
				}
			}

			if (
				cteMessage.dateTimeUpdate != undefined ||
				cteMessage.documentFederalKey != undefined ||
				cteMessage.senderFederalID != undefined
			) {
				Object.assign(configObj.params, {
					Filter: setFilters
				});
			}

			const generateToken: IGetToken = await getTokenUrlGlobal(
				process.env.PROTHEUSVIVEO_CTE_BASEURL +
					process.env.PROTHEUSVIVEO_PASS_CTE
			);

			loggerElastic(
				this.indexName,
				this.isCode,
				this.originLayer,
				this.serviceNameGet,
				JSON.stringify(cteMessage),
				JSON.stringify(objSend)
			);

			if (generateToken.access_token) {
				Object.assign(configObj.headers, {
					Authorization: 'Bearer ' + generateToken.access_token
				});

				return objSend;
			} else {
				return {
					code: StatusCodeCte.noToken,
					message: TreatmentCte.noToken,
					detailedMessage: TreatmentCte.detailToken
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

	public async CteSchedule(cteMessage: IDocumentsCteGet) {
		try {
			if (cteMessage) {
				const nowDate = format(
					sub(new Date(), { minutes: 10 }),
					'yyyy-MM-dd HH:mm:ss'
				);
				const configObj: IDocumentsObjGet = {
					method: 'get',
					maxBodyLength: Infinity,
					url:
						process.env.PROTHEUSVIVEO_CTE_BASEURL +
						process.env.PROTHEUSVIVEO_CTE_DOCUMENTS,
					headers: {
						TenantID: '04,001001',
						ForceAudit: 'true',
						ForceOptimize: 'true',
						ForceUseAdapter: 'false'
					},
					params: {
						Filter: `dateTimeUpdate gt '${nowDate}'`
					}
				};

				const objSend: IProtheusSend = {
					objtRequest: configObj
				};

				const generateToken: IGetToken = await getTokenUrlGlobal(
					process.env.PROTHEUSVIVEO_CTE_BASEURL +
						process.env.PROTHEUSVIVEO_PASS_CTE
				);

				loggerElastic(
					this.indexName,
					this.isCode,
					this.originLayer,
					this.serviceNameSchedule,
					JSON.stringify(cteMessage),
					JSON.stringify(objSend)
				);

				if (generateToken.access_token) {
					Object.assign(configObj.headers, {
						Authorization: 'Bearer ' + generateToken.access_token
					});

					return objSend;
				} else {
					return {
						code: StatusCodeCte.noToken,
						message: TreatmentCte.noToken,
						detailedMessage: TreatmentCte.detailToken
					};
				}
			}
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

	public async ValidSchedule(cteMessage: ISendWebHook) {
		try {
			const mountArr = cteMessage.data;
			loggerElastic(
				this.indexName,
				this.isCode,
				this.originLayer,
				this.serviceNameSchedule,
				JSON.stringify(cteMessage),
				JSON.stringify(mountArr)
			);
			mountArr.documents.forEach((sendEnv) => {
				if (
					sendEnv.senderName === CompaniesNameWebhook.jarilogName &&
					sendEnv.senderFederalID === CompaniesCNPJWebhook.jarilogCnpj
				) {
					return ''; //URL DO PARCEIRO
				} else {
					//SETA ERRO
				}

				loggerElastic(
					this.indexName,
					this.isCode,
					this.originLayer,
					this.serviceNameSchedule,
					JSON.stringify(cteMessage),
					JSON.stringify(mountArr)
				);
			});
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
