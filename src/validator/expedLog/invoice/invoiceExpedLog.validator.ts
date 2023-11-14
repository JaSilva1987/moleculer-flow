import { Static, Type } from '@sinclair/typebox';

export const InvoiceIntegrationExpedLogSchema = Type.Object({
	cnpjEmpresa: Type.String(),
	cnpjFilial: Type.String(),
	notaFiscal: Type.String()
});

export type invoiceIntegrationExpedLogSchemaType = Static<
	typeof InvoiceIntegrationExpedLogSchema
>;

export const FetchInvoiceExpedLogSchema = Type.Object({
	erp: Type.String(),
	cnpjEmpresa: Type.String(),
	nomeEmpresa: Type.String(),
	cnpjFilial: Type.String(),
	nomeFilial: Type.String(),
	projeto: Type.String(),
	numeroNF: Type.String(),
	serieNF: Type.String(),
	chaveAcessoNF: Type.String(),
	statusIntegracaoExpedLog: Type.String(),
	statusIntegracaoComprovei: Type.String(),
	informacoesComplementares: Type.Object({}),
	arquivos: Type.Array(Type.Object({}))
});

export const FetchInvoiceArrayExpedLogSchema = Type.Array(
	FetchInvoiceExpedLogSchema
);

export type fetchInvoiceArrayExpedLogSchemaType = Static<
	typeof FetchInvoiceArrayExpedLogSchema
>;

export type fetchInvoiceExpedLogSchemaType = Static<
	typeof FetchInvoiceExpedLogSchema
>;
