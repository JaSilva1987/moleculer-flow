import { IResponseExpedLog } from './expedLog.interface';

export interface IInvoiceIntegrationExpedLog {
	cnpjEmpresa: string;
	cnpjFilial: string;
	notaFiscal: string;
}
export interface IIInvoiceIntegrationExpedLog {
	dataEmissaoNfDe: string;
	dataEmissaoNfAte: string;
	cnpjEmpresa: string;
	cnpjEmitente: string;
	numeroNF: string;
	chaveAcesso: string;
	statusIntegracaoExpedLog: string;
	statusIntegracaoComprovei: string;
}

export interface IAdditionalInformationExpedLog {
	codigoCliente: string;
	tipoCarga: string;
	durabilidadeEtiqueta: string;
	tipoProduto: string;
	nomeConsultorInterno: string;
	telefoneConsultorInterno: string;
	nomeConsultorExterno: string;
	telefoneConsultorExterno: string;
	clienteFoco: string;
	agendamentoEntrega: string;
	itensNota: IInvoiceItensExpedLog[];
}

export interface IInvoiceItensExpedLog {
	nomeLaboratorio: string;
	cnpjLaboratorio: string;
	segmentacaoComercial: string;
	codigoEAN: string;
}

export interface IInvoiceIntegrationExpedLogReturn {
	code?: string | number;
	status: number;
	message?: string;
	detailedMessage?: string;
	helpUrl?: string;
	details?: Array<object>;
	total?: number;
}

export interface IFetchInvoiceExpedLogReturn {
	erp: string;
	cnpjEmpresa: string;
	nomeEmpresa: string;
	cnpjFilial: string;
	nomeFilial: string;
	projeto: string;
	numeroNF: string;
	serieNF: string;
	chaveAcessoNF: string;
	statusIntegracaoExpedLog: string;
	statusIntegracaoComprovei: string;
	dataPrevistaEntrega: string;
	informacoesComplementares: IAdditionalInformationExpedLog;
	arquivos: IInvoiceFileStructureExpedLog[];
	followupIntegracao: IInvoiceFollowUPExpedLog[];
	retorno: IResponseExpedLog;
}

export interface IInvoiceFollowUPExpedLog {
	dataHoraOcorrencia: string;
	ocorrencia: string;
	status: string;
	observacao: string;
	usuario: string;
}

export interface IInvoiceFileStructureExpedLog {
	dataCriacao: string;
	tipoArquivo: string;
	url: string;
	conteudoArquivo: string;
}
