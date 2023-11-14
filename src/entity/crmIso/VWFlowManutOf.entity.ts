import { ViewColumn, ViewEntity } from 'typeorm';

@ViewEntity({
	name: 'VWFlowManutOF',
	expression: `select * from VWFlowManutOF`
})
export class VWFlowManutOfEntity {
	@ViewColumn() FILIAL: string;
	@ViewColumn() OFNRO: string;
	@ViewColumn() Seq: string;
	@ViewColumn() FatPar: string;
	@ViewColumn() CXFech: string;
	@ViewColumn() Lote_unico: string;
	@ViewColumn() Vcto_proximo: string;
	@ViewColumn() Valor_tolerancia: number;
	@ViewColumn() Libera_abaixo_minimo: string;
	@ViewColumn() Data_Previsao_fat: string;
	@ViewColumn() Retido_Usuario: string;
	@ViewColumn() Processado: string;
	@ViewColumn() DH_Processamento: string;
	@ViewColumn() Observacoes_NFE: string;
	@ViewColumn() Cancelar_pedido: string;
	@ViewColumn() Voltar_Pedido_ISO: string;
	@ViewColumn() ITEM_Seq: string;
	@ViewColumn() ITEM_Seq_CRM: string;
	@ViewColumn() ITEM_DataPrevFat: string;
	@ViewColumn() ITEM_CancSaldo: string;
	@ViewColumn() Tipo_Triang: string;
	@ViewColumn() Tab_Preco: string;
	@ViewColumn() CNPJ_Cliente: string;
	@ViewColumn() Nro_Pedido_CRM: string;
	@ViewColumn() ManOF_QuebraOF45M3: string;
}
