export interface INewDevolutionExpedLog {
	cnpjFilial: string;
	nomeEmpresa: string;
	cnpjEmpresa: string;
	cnpjEmissor: string;
	notaFiscal: string;
	serieNotaFiscal: string;
	emissao: string;
	chave: string;
	cnpj: string;
	tipo: string;
	tipoParada: string;
	codigoSolicitante: string;
	dataSolicitacao: string;
	numeroDevolucao: string;
	statusDevolucao: string;
	descricaoStatusDevolucao: string;
	valordaColeta: number;
	cliente: object;
	itens: object[];
}
