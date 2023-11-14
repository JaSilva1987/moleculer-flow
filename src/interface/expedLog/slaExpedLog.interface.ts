export interface ISLARecalculationExpedLog {
	cnpjEmpresa: string;
	cnpjFilial: string;
	nroNotaFiscal: string;
	chaveAcesso: string;
	dataEmissaoNF: string;
	dataExpedicao: string;
}

export interface ISLASearchTableExpedLog {
	cnpjEmpresa: string;
	cnpjFilial: string;
	estado: string;
	municipio: string;
	dataHoraCorte: string;
	tipoProduto: number;
}
