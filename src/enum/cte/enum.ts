export enum TreatmentCte {
	inconsistency = 'Inconsistent JSON, does not fit one of the three accepted models',
	noToken = 'ERP Protheus out, impossible to generate token',
	noDetailsErr = 'There are no error details',
	detailToken = 'Protheus ERP authentication failed',
	timeOutProtheus = 'Timeout in Protheus ERP response, Try again',
	timeOut = 'Timeout',
	jsonFormat = 'JSON invalid model, please review the fields',
	protheusOut = 'No connection to erp protheus'
}

export enum StatusCodeCte {
	validationJson = '406',
	noToken = '401',
	isTimeout = '504'
}

export enum CompaniesCNPJWebhook {
	jarilogCnpj = '49.368.217/0001-48'
}

export enum CompaniesNameWebhook {
	jarilogName = 'JARILOG LOGISTICA LTDA'
}
