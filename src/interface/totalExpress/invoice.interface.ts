export interface IInvoiceTotalExpress {
	remetenteId: number;
	cnpj: string;
	remessaCodigo: string;
	encomendas: [IInvoiceOrder];
}

export interface IInvoiceOrder {
	servicoTipo: number;
	entregaTipo: string;
	peso: number;
	volumes: number;
	condFrete: string;
	pedido: string;
	clienteCodigo: number;
	natureza: string;
	icmsIsencao: number;
	destinatario: IInvoiceRecipient;
	docFiscal: {
		nfe: [IInvoiceTaxDocE];
	};
}

export interface IInvoiceRecipient {
	nome: string;
	cpfCnpj: string;
	endereco: IInvoiceRecipientAdress;
	email: string;
}

export interface IInvoiceRecipientAdress {
	logradouro: string;
	numero: string;
	complemento: string;
	pontoReferencia: string;
	bairro: string;
	cidade: string;
	estado: string;
	cep: string;
}

export interface IInvoiceTaxDocE {
	nfeNumero: number;
	nfeSerie: string;
	nfeData: string;
	nfeValTotal: number;
	nfeValProd: number;
	nfeChave: string;
}

export interface IInvoiceTaxDoc {
	nfNumero: number;
	nfSerie: string;
	nfData: string;
	nfValTotal: number;
	nfValBc: number;
	nfValIcms: number;
	nfValBcSt: number;
	nfValIcmsSt: number;
	nfValProd: number;
	nfCfop: number;
}
