import { Static, Type } from '@sinclair/typebox';

export const NewDevolutionExpedLogSchema = Type.Object({
	cnpjFilial: Type.String({ minLength: 14, maxLength: 14 }),
	nomeEmpresa: Type.String(),
	cnpjEmpresa: Type.String({ minLength: 14, maxLength: 14 }),
	cnpjEmissor: Type.String({ minLength: 14, maxLength: 14 }),
	notaFiscal: Type.String(),
	serieNotaFiscal: Type.String(),
	emissao: Type.String(),
	chave: Type.String(),
	cnpj: Type.String(),
	tipo: Type.String(),
	tipoParada: Type.String(),
	codigoSolicitante: Type.String(),
	dataSolicitacao: Type.String(),
	numeroDevolucao: Type.String(),
	statusDevolucao: Type.String(),
	descricaoStatusDevolucao: Type.String(),
	valordaColeta: Type.Number(),
	cliente: Type.Object({}),
	itens: Type.Array(Type.Object({}))
});

export type newDevolutionExpedLogSchemaType = Static<
	typeof NewDevolutionExpedLogSchema
>;

export const DevolutionCollectionStatusExpedLogSchema = Type.Object({
	cnpjFilial: Type.String({ minLength: 14, maxLength: 14 }),
	cnpjEmpresa: Type.String({ minLength: 14, maxLength: 14 }),
	numOrdemColeta: Type.String(),
	notaFiscal: Type.String(),
	serieNotaFiscal: Type.String(),
	emissao: Type.String(),
	chave: Type.String(),
	statusColetado: Type.String(),
	dataIntColetado: Type.String(),
	horaIntColetado: Type.String()
});

export type devolutionCollectionStatusExpedLogSchemaType = Static<
	typeof DevolutionCollectionStatusExpedLogSchema
>;
