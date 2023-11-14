export interface IPoolCheckChangedOf {
	tenantId: string;
	branchId: string;
	orderId: string;
	orderIdERP: string;
	sourceCrm: string;
	resetPedidoIso?: string;
	cancelPedido?: string;
	aItemPedido?: IIPoolCheckChangedOf[];
}

export interface IIPoolCheckChangedOf {}

export interface IIIPoolCheckChangedOf {
	tenantId: string;
	branchId: string;
	orderId: string;
	orderIdERP: string;
	resetPedidoIso?: string;
	cancelPedido?: string;
	sourceCrm?: string;
	aItemPedido?: IVPoolCheckChangedOf;
}
export interface IVPoolCheckChangedOf {
	FILIAL?: string;
	OFNRO?: string;
	Seq?: number;
	FatPar?: string;
	CXFech?: string;
	Lote_unico?: string;
	Vcto_proximo?: string;
	Valor_tolerancia?: number;
	Libera_abaixo_minimo?: string;
	Data_Previsao_fat?: string;
	Retido_Usuario?: string;
	Processado?: string;
	DH_Processamento?: Date;
	Observacoes_NFE?: string;
	Cancelar_pedido?: string;
	Voltar_Pedido_ISO?: string;
	ITEM_Seq?: string;
	ITEM_Seq_CRM?: string;
	ITEM_DataPrevFat?: string;
	ITEM_CancSaldo?: string;
	Tipo_Triang?: string;
	Tab_Preco?: number;
	CNPJ_Cliente?: string;
	Nro_Pedido_CRM?: string;
	ManOF_QuebraOF45M3?: string;
}
