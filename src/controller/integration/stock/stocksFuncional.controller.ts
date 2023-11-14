import { Errors, ServiceBroker } from 'moleculer';
import {
	RouteApiFuncional,
	TreatmentFuncional
} from '../../../enum/funcional/enum';
import {
	INewStocksFuncional,
	IReturnFuncionalSProtheus,
	IStocksFuncional,
	TreatmentControllerStock
} from '../../../interface/funcional/stock/stocksFuncional.interface';

export default class StocksFuncionalBusinessRule {
	broker: ServiceBroker;
	isRequest: string;
	mountingResponse: object;
	mountingMResponse: object;
	mountingEResponse: object;
	paramFilter = 'Filter';
	public async validatesRoutes(requestApi: IStocksFuncional) {
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

		const isPage =
			requestApi.pageNumber != undefined ? requestApi.pageNumber : '0';
		const isNumber =
			requestApi.pageSize != undefined ? requestApi.pageSize : '0';

		const businessRule: INewStocksFuncional = {
			protheus: this.isRequest,
			codeEAN: requestApi.codeEAN,
			numberPage: isPage,
			numbeSize: isNumber,
			urlObj: {}
		};

		if (requestApi.codeEAN != undefined) {
			Object.assign(businessRule.urlObj, {
				codeEAN: requestApi.internalCode
			});
		}

		if (Number(isPage) > 0) {
			Object.assign(businessRule.urlObj, {
				Page: requestApi.pageNumber,
				PageSize: requestApi.pageSize
			});
		}

		if (requestApi.internalCode != undefined) {
			Object.assign(businessRule.urlObj, {
				[this.paramFilter]: `internalCode=${requestApi.internalCode}`
			});
		}

		if (requestApi.productEAN != undefined) {
			Object.assign(businessRule.urlObj, {
				[this.paramFilter]: `productEAN=${requestApi.productEAN})`
			});
		}

		return businessRule;
	}

	public async treatementResponseMafra(responseApi: Array<object>) {
		try {
			responseApi.forEach(
				(mafraT: { responseTotvs: object; isValid: boolean }) => {
					const subObject: TreatmentControllerStock = Object(
						mafraT.responseTotvs
					);
					if (mafraT.isValid == true) {
						const searchMessage = Object(subObject.message);
						if (Object.keys(searchMessage).length > 0) {
							const entriesMessage: IReturnFuncionalSProtheus = {
								total: searchMessage.total,
								hasNext: searchMessage.hasNext,
								stocks: searchMessage.data
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

			return this.mountingResponse;
		} catch (error) {
			return new Errors.MoleculerError(error.message, error.code);
		}
	}

	public async treatementResponseExpressa(responseApi: Array<object>) {
		try {
			responseApi.forEach(
				(expressaT: { responseTotvs: object; isValid: boolean }) => {
					const subObject: TreatmentControllerStock = Object(
						expressaT.responseTotvs
					);

					if (expressaT.isValid == true) {
						const searchMessage = Object(subObject.message);
						if (Object.keys(searchMessage).length > 0) {
							const entriesMessage: IReturnFuncionalSProtheus = {
								total: searchMessage.total,
								hasNext: searchMessage.hasNext,
								stocks: searchMessage.data.stocks
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

			return this.mountingResponse;
		} catch (error) {
			return new Errors.MoleculerError(error.message, error.code);
		}
	}

	public async treatementResponseGlobal(responseMafra: Array<object>) {
		try {
			responseMafra.forEach(
				(mafraT: { responseTotvs: object; isValid: boolean }) => {
					const subObject: TreatmentControllerStock = Object(
						mafraT.responseTotvs
					);

					if (mafraT.isValid == true) {
						const searchMessage = Object(subObject.message);
						if (Object.keys(searchMessage).length > 0) {
							const entriesMessage: IReturnFuncionalSProtheus = {
								total:
									searchMessage.data.length > 0
										? searchMessage.data.length
										: 0,
								hasNext: false,
								stocks: searchMessage.data,
								success: searchMessage.success
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
					stocks: this.mountingEResponse
				}
			};
		} catch (error) {
			return new Errors.MoleculerError(error.message, error.code);
		}
	}
}
