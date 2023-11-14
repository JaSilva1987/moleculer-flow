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
	INewProductsFuncional,
	IProductsFuncional,
	IReturnFuncionalPProtheus,
	TreatmentControllerProduct
} from '../../../interface/funcional/product/productsFuncional.interface';

export default class ProductsFuncionalBusinessRule {
	broker: ServiceBroker;
	isRequest: string;
	mountingResponse: object;
	mountingMResponse: object;
	mountingEResponse: object;
	filterEan: string;
	paramFilter = 'Filter';
	indexName = 'flow-funcional-products';
	isCode = '200';
	originLayer = 'controller';
	serviceName = 'ProductsFuncionalBusinessRule';
	public async validatesRoutes(requestApi: IProductsFuncional) {
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

		const businessRule: INewProductsFuncional = {
			protheus: this.isRequest,
			urlObj: {}
		};

		if (Number(requestApi.pageNumber) > 0) {
			Object.assign(businessRule.urlObj, {
				Page: requestApi.pageNumber,
				PageSize: requestApi.pageSize
			});
		}

		const isEan =
			requestApi.productEAN != undefined
				? requestApi.productEAN.includes('[')
				: false;

		if (isEan == true) {
			this.filterEan =
				requestApi.productEAN != undefined
					? `productEAN=${requestApi.productEAN}`
					: '';
		} else {
			this.filterEan =
				requestApi.productEAN != undefined
					? `startswith(productEAN,'${requestApi.productEAN}')`
					: '';
		}

		if (this.filterEan != '') {
			Object.assign(businessRule.urlObj, {
				[this.paramFilter]: this.filterEan
			});
		}

		if (requestApi.internalCode != undefined) {
			Object.assign(businessRule.urlObj, {
				[this
					.paramFilter]: `contains(internalCode,'${requestApi.internalCode}')`
			});
		}

		return businessRule;
	}

	public async treatementResponseMafra(responseApi: Array<object>) {
		try {
			responseApi.forEach(
				(mafraT: { responseTotvs: object; isValid: boolean }) => {
					const subObject: TreatmentControllerProduct = Object(
						mafraT.responseTotvs
					);
					if (mafraT.isValid == true) {
						const searchMessage = Object(subObject.message);
						if (Object.keys(searchMessage).length > 0) {
							const entriesMessage: IReturnFuncionalPProtheus = {
								total: searchMessage.data.products.length,
								hasNext: searchMessage.hasNext,
								products: searchMessage.data.products
							};

							this.mountingResponse = {
								viveo: {
									mafra: entriesMessage
								}
							};
						} else {
							this.mountingResponse = {
								code: 400,
								message: TreatmentFuncional.protheusNull
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

			loggerElastic(
				this.indexName,
				this.isCode,
				this.originLayer,
				this.serviceName,
				JSON.stringify(responseApi),
				JSON.stringify(this.mountingResponse)
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
				async (expressaT: {
					responseTotvs: object;
					isValid: boolean;
				}) => {
					const subObject: TreatmentControllerProduct = Object(
						expressaT.responseTotvs
					);
					if (expressaT.isValid == true) {
						const searchMessage = Object(subObject.message);
						if (Object.keys(searchMessage).length > 0) {
							const entriesMessage: IReturnFuncionalPProtheus = {
								total: searchMessage.data.products.length,
								hasNext: searchMessage.hasNext,
								products: searchMessage.data.products
							};

							this.mountingResponse = {
								viveo: {
									expressa: entriesMessage
								}
							};
						} else {
							this.mountingResponse = {
								code: 400,
								message: TreatmentFuncional.protheusNull
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

			loggerElastic(
				this.indexName,
				this.isCode,
				this.originLayer,
				this.serviceName,
				JSON.stringify(responseApi),
				JSON.stringify(this.mountingResponse)
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
					const subObject: TreatmentControllerProduct = Object(
						mafraT.responseTotvs
					);
					if (mafraT.isValid == true) {
						const searchMessage = Object(subObject.message);
						if (Object.keys(searchMessage).length > 0) {
							const entriesMessage: IReturnFuncionalPProtheus = {
								total: searchMessage.data.products.length,
								hasNext: searchMessage.hasNext,
								products: searchMessage.data.products
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
					const subObject: TreatmentControllerProduct = Object(
						expressaT.responseTotvs
					);
					if (expressaT.isValid == true) {
						const searchMessage = Object(subObject.message);
						if (Object.keys(searchMessage).length > 0) {
							const entriesMessage: IReturnFuncionalPProtheus = {
								total: searchMessage.data.products.length,
								hasNext: searchMessage.hasNext,
								products: searchMessage.data.products
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

			loggerElastic(
				this.indexName,
				this.isCode,
				this.originLayer,
				this.serviceName,
				JSON.stringify({
					mafra: responseMafra,
					expressa: responseExpressa
				}),
				JSON.stringify({
					mafra: this.mountingMResponse,
					expressa: this.mountingEResponse
				})
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
				JSON.stringify(
					JSON.stringify({
						mafra: responseMafra,
						expressa: responseExpressa
					})
				),
				JSON.stringify(error.message)
			);
			apmElasticConnect.captureError(new Error(error.message));
			return new Errors.MoleculerError(error.message, error.code);
		}
	}
}
