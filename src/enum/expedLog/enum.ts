export enum StatusCodeExpedLog {
	error = '400',
	validationJson = '406',
	noToken = '401',
	serverError = '500',
	isTimeout = '504',
	databaseError = '500',
	success = '200'
}

export enum TreatmentExpedLog {
	requestSuccessful = 'Request successful',
	requestError = 'Request error',
	inconsistency = 'JSON body is inconsistent',
	arrayExpected = 'An array is expected',
	noToken = 'ExpedLog Token API error',
	noDetailsErr = 'There are no error details',
	detailToken = 'ExpedLog authentication failed',
	timeOutProtheus = 'Timeout in Protheus ERP response, Try again',
	timeOut = 'Timed out',
	jsonFormat = 'JSON invalid model, please review the fields',
	databaseError = 'Error while saving data in the database',
	success = 'Success',
	invoiceDataReceived = 'Invoice data received',
	devolutionDataReceived = 'Devolution data received',
	serverError = 'ExpedLog Server Error'
}
