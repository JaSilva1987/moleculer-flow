export interface IDocumentsCtePostOne {
	data: IIDocumentsCtePostOne[];
	meta?: string;
}
export interface IIIDocumentsCtePostOne {
	documentSerie: string;
	document: string;
	documentFederalKey: string;
	submissionDate: string;
	issueDate: string;
	operationTaxCode: string;
	freightType: string;
	transportType: string;
	packages: number;
	value: number;
	weight: number;
	addresseeFederalID: string;
	addresseeStateTaxRegistrationNumber: string;
	addresseeName: string;
	addresseeAddress: string;
	addresseeAddressNumber: string;
	addresseeNeighbourhood: string;
	addresseeCityCode: string;
	addresseeCity: string;
	addresseeCEP: string;
	addresseeState: string;
	addresseeCountryBACENode: string;
	addresseeCountryIBGECode: string;
	addresseeDDDPhone: string;
	addresseePhone: string;
	addresseeMail: string;
	cteDocument: string;
	cteSerie: string;
	cteType: string;
	cteFederalKey: string;
	receiverFederalID?: string;
	receiverName?: string;
	receiverAddress?: string;
	receiverAddressNumber?: string;
	receiverNeighbourhood?: string;
	receiverCityCode?: string;
	receiverCity?: string;
	receiverCEP?: string;
	receiverState?: string;
	receiverCountryBACENode?: string;
	receiverCountryIBGECode?: string;
	receiverMail?: string;
	receiverPhone?: string;
	receiverDDDPhone?: string;
	receiverStateTaxRegistrationNumber?: string;
}
export interface IIDocumentsCtePostOne {
	senderFederalID: string;
	senderName: string;
	notifyEndpoint: string;
	documents: IIIDocumentsCtePostOne[];
}
export interface IDocumentsCtePostTwo {
	data: IIDocumentsCtePostTwo[];
	meta?: string;
}
export interface IIIDocumentsCtePostTwo {
	xmlType: string;
	xmlContent: string;
}
export interface IIDocumentsCtePostTwo {
	senderFederalID: string;
	senderName: string;
	notifyEndpoint: string;
	documents: IIIDocumentsCtePostTwo[];
}
export interface IDocumentsCteGet {
	pageNumber: string;
	pageSize: string;
	orderId: string;
	dateTimeUpdate: string;
	documentFederalKey: string;
	senderFederalID: string;
	meta?: string;
}
export interface IIDocumentsCteGet {}
export interface IDocumentsCteReturn {
	code?: string | number;
	status: number;
	message?: string;
	detailedMessage?: string;
	helpUrl?: string;
	details?: Array<object>;
	total?: number;
}
export interface IDocumentsObjPost {
	method: string;
	maxBodyLength: any;
	url: string;
	headers: IIDocumentsObjPost;
	data: any;
}
export interface IIDocumentsObjPost {
	TenantID: string;
	ForceAudit: string;
	ForceOptimize: string;
	ForceUseAdapter: string;
	'Content-Type': string;
}
export interface IDocumentsObjGet {
	method: string;
	maxBodyLength: any;
	url: string;
	headers: IIDocumentsObjGet;
	params: object;
}
export interface IIDocumentsObjGet {
	TenantID: string;
	ForceAudit: string;
	ForceOptimize: string;
	ForceUseAdapter: string;
}
export interface IProtheusSend {
	objtRequest: object;
}
export interface IIGetTokenCte {
	access_token: string;
	refresh_token: string;
	scope: string;
	token_type: string;
	expires_in: number;
}
export interface IIISendWebHook {
	senderFederalID: string;
	senderName: string;
	receiverFederalID: string;
	receiverName: string;
	document: string;
	serieDocument: string;
	documentFederalKey: string;
	submissionDate: string;
	issueDate: string;
	cteStatus: string;
	cteEmissionDate: string;
	cteEmissionHour: string;
	cteFederalKey: string;
	cteValue: number;
	weight: number;
	documentValue: number;
	cteXML: string;
	dateTimeUpdate: string;
}
export interface IISendWebHook {
	documents: IIISendWebHook[];
}
export interface ISendWebHook {
	total: number;
	hasNext: boolean;
	data: IISendWebHook;
}
