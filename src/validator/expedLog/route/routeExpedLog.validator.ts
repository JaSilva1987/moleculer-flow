import { Static, Type } from '@sinclair/typebox';

export const NewRouteExpedLogSchema = Type.Object({
	numero: Type.String(),
	rotadestino: Type.String(),
	rotanome: Type.String(),
	data: Type.String(),
	regiao: Type.String(),
	transportadora: Type.Object({}),
	motorista: Type.Object({}),
	base: Type.Object({}),
	limites: Type.Object({}),
	tipoRota: Type.String(),
	tipoMaterial: Type.String(),
	fornecimento: Type.String(),
	tipoFrete: Type.String(),
	paradas: Type.Array(Type.Object({}))
});

export type newRouteExpedLogSchemaType = Static<typeof NewRouteExpedLogSchema>;
