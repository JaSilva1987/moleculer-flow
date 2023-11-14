import { Static, Type } from '@sinclair/typebox';

export const ScheduleDeliveryExpedLogSchema = Type.Object({
	cnpjEmpresa: Type.String(),
	cnpjFilial: Type.String(),
	nroNotaFiscal: Type.String(),
	chaveAcesso: Type.String(),
	dataEmissaoNF: Type.String(),
	dataExpedicao: Type.String()
});

export type scheduleDeliveryExpedLogSchemaType = Static<
	typeof ScheduleDeliveryExpedLogSchema
>;
