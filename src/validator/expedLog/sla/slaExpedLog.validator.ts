import { Static, Type } from '@sinclair/typebox';

export const SLARecalculationExpedLogSchema = Type.Object({
	cnpjEmpresa: Type.String(),
	cnpjFilial: Type.String(),
	nroNotaFiscal: Type.String(),
	chaveAcesso: Type.String(),
	dataEmissaoNF: Type.String(),
	dataExpedicao: Type.String()
});

export type slaRecalculationExpedLogSchemaType = Static<
	typeof SLARecalculationExpedLogSchema
>;

export const SLASearchTableExpedLogSchema = Type.Object({
	cnpjEmpresa: Type.String(),
	cnpjFilial: Type.String(),
	estado: Type.String(),
	municipio: Type.String(),
	dataHoraCorte: Type.String(),
	tipoProduto: Type.Number()
});

export type slaSearchTableExpedLogSchemaType = Static<
	typeof SLASearchTableExpedLogSchema
>;
