import { Errors, ServiceBroker } from 'moleculer';
import {
	apmElasticConnect,
	loggerElastic
} from '../../../../services/library/elasticSearch';
import {
	RouteApiFuncional,
	TreatmentFuncional
} from '../../../enum/funcional/enum';
import {
	ICustomersFuncional,
	INewCustomersFuncional,
	IReturnFuncionalProtheus,
	TreatmentControllerCustomer
} from '../../../interface/funcional/customer/customersFuncional.interface';

export default class CustomersFuncionalBusinessRule {
	broker: ServiceBroker;
	isRequest: string;
	mountingResponse: object;
	mountingMResponse: object;
	mountingEResponse: object;
	paramFilter = 'Filter';
	indexName = 'flow-funcional-customers';
	isCode = '200';
	originLayer = 'controller';
	serviceName = 'CustomersFuncionalBusinessRule';
	public async validatesRoutes(requestApi: ICustomersFuncional) {
		switch (requestApi.groupId) {
			case '01':
				this.isRequest = RouteApiFuncional.numberOne;
				break;
			case '99':
				this.isRequest = RouteApiFuncional.numberNinetyNine;
				break;
			default:
				this.isRequest = RouteApiFuncional.numberZero;
				break;
		}

		const businessRule: INewCustomersFuncional = {
			protheus: this.isRequest,
			urlObj: {}
		};

		if (Number(requestApi.pageNumber) > 0) {
			Object.assign(businessRule.urlObj, {
				Page: requestApi.pageNumber,
				PageSize: requestApi.pageSize
			});
		}
		if (requestApi.federalID != undefined) {
			Object.assign(businessRule.urlObj, {
				[this
					.paramFilter]: `startswith(federalID,'${requestApi.federalID}')`
			});
		}

		if (requestApi.stateName != undefined) {
			Object.assign(businessRule.urlObj, {
				[this
					.paramFilter]: `startswith(state,'${requestApi.stateName}')`
			});
		}

		if (requestApi.customerID != undefined) {
			Object.assign(businessRule.urlObj, {
				[this.paramFilter]: `customerID=${requestApi.customerID}`
			});
		}

		return businessRule;
	}

	public async treatementResponseMafra(responseApi: Array<object>) {
		try {
			responseApi.forEach(
				(mafraT: { responseTotvs: object; isValid: boolean }) => {
					const subObject: TreatmentControllerCustomer = Object(
						mafraT.responseTotvs
					);
					if (mafraT.isValid == true) {
						const searchMessage = Object(subObject.message);
						if (Object.keys(searchMessage).length > 0) {
							const entriesMessage: IReturnFuncionalProtheus = {
								total: searchMessage.data.customers.length,
								hasNext: searchMessage.hasNext,
								customers: searchMessage.data.customers
							};

							this.mountingResponse = {
								viveo: {
									mafra: entriesMessage
								}
							};
						} else {
							this.mountingResponse = {
								viveo: {
									code: 400,
									message: TreatmentFuncional.protheusNull
								}
							};
						}
					} else {
						this.mountingResponse = {
							viveo: {
								mafra: subObject
							}
						};
					}
				}
			);

			return this.mountingResponse;
		} catch (error) {
			loggerElastic(
				this.indexName,
				error.code,
				this.originLayer,
				this.serviceName,
				JSON.stringify(responseApi),
				JSON.stringify(error.message)
			);
			apmElasticConnect.captureError(new Error(error.message));
			return new Errors.MoleculerError(error.message, error.code);
		}
	}

	public async treatementResponseExpressa(responseApi: Array<object>) {
		try {
			responseApi.forEach(
				(expressaT: { responseTotvs: object; isValid: boolean }) => {
					const subObject: TreatmentControllerCustomer = Object(
						expressaT.responseTotvs
					);
					if (expressaT.isValid == true) {
						const searchMessage = Object(subObject.message);
						if (Object.keys(searchMessage).length > 0) {
							const entriesMessage: IReturnFuncionalProtheus = {
								total: searchMessage.data.customers.length,
								hasNext: searchMessage.hasNext,
								customers: searchMessage.data.customers
							};

							this.mountingResponse = {
								viveo: {
									expressa: entriesMessage
								}
							};
						} else {
							this.mountingResponse = {
								viveo: {
									code: 400,
									message: TreatmentFuncional.protheusNull
								}
							};
						}
					} else {
						this.mountingResponse = {
							viveo: {
								expressa: subObject
							}
						};
					}
				}
			);

			return this.mountingResponse;
		} catch (error) {
			loggerElastic(
				this.indexName,
				error.code,
				this.originLayer,
				this.serviceName,
				JSON.stringify(responseApi),
				JSON.stringify(error.message)
			);
			apmElasticConnect.captureError(new Error(error.message));
			return new Errors.MoleculerError(error.message, error.code);
		}
	}

	public async treatementResponseGlobal(
		responseMafra: Array<object>,
		responseExpressa: Array<object>
	) {
		try {
			responseMafra.forEach(
				(mafraT: { responseTotvs: object; isValid: boolean }) => {
					const subObject: TreatmentControllerCustomer = Object(
						mafraT.responseTotvs
					);
					if (mafraT.isValid == true) {
						const searchMessage = Object(subObject.message);
						if (Object.keys(searchMessage).length > 0) {
							const entriesMessage: IReturnFuncionalProtheus = {
								total: searchMessage.data.customers.length,
								hasNext: searchMessage.hasNext,
								customers: searchMessage.data.customers
							};

							this.mountingMResponse = entriesMessage;
						} else {
							this.mountingResponse = {
								code: 400,
								message: TreatmentFuncional.protheusNull
							};
						}
					} else {
						this.mountingMResponse = subObject;
					}
				}
			);

			responseExpressa.forEach(
				(expressaT: { responseTotvs: object; isValid: boolean }) => {
					const subObject: TreatmentControllerCustomer = Object(
						expressaT.responseTotvs
					);
					if (expressaT.isValid == true) {
						const searchMessage = Object(subObject.message);
						if (Object.keys(searchMessage).length > 0) {
							const entriesMessage: IReturnFuncionalProtheus = {
								total: searchMessage.data.customers.length,
								hasNext: searchMessage.hasNext,
								customers: searchMessage.data.customers
							};

							this.mountingEResponse = entriesMessage;
						} else {
							this.mountingResponse = {
								code: 400,
								message: TreatmentFuncional.protheusNull
							};
						}
					} else {
						this.mountingEResponse = subObject;
					}
				}
			);

			return {
				viveo: {
					mafra: this.mountingMResponse,
					expressa: this.mountingEResponse
				}
			};
		} catch (error) {
			loggerElastic(
				this.indexName,
				error.code,
				this.originLayer,
				this.serviceName,
				JSON.stringify({
					mafra: responseMafra,
					expressa: responseExpressa
				}),
				JSON.stringify(error.message)
			);
			apmElasticConnect.captureError(new Error(error.message));

			return new Errors.MoleculerError(error.message, error.code);
		}
	}
}
