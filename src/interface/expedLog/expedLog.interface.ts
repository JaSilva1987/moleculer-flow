export interface IDynamicTokenExpedLog {
	cnpjEmpresa: string;
	cnpjFilial: string;
}

export interface IDynamicIdentifierExpedLog {
	cnpjEmpresa?: string;
	cnpjFilial?: string;
	erp?: string;
}

export interface ITokenExpedLog {
	token: string;
	tipoToken: string;
	usuario: string;
	dataHoraEmissao: string;
	dataHoraExpiracao: string;
	retorno: IResponseExpedLog;
}

export interface IResponseExpedLog {
	codigo: string;
	mensagem: string;
}

export interface IExpedLogObjPost {
	method: string;
	maxBodyLength: any;
	url?: string;
	headers: IExpedLogHeaders;
	data: any;
}

export interface IExpedLogHeaders {
	ForceAudit?: string;
	ForceOptimize?: string;
	ForceUseAdapter?: string;
	'Content-Type'?: string;
	Authorization?: string;
}

export interface IExpedLogReturn {
	code?: number;
	status: number;
	message?: string;
	detailedMessage?: string;
	helpUrl?: string;
	details?: Array<object>;
	total?: number;
}
