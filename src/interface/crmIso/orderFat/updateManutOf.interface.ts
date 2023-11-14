export interface IUpdateManutOf {
	ManOF_Processado: string;
	ManOF_DHProc: Date;
	ManOF_Filial: string;
	ManOF_OFNro: string;
	ManOF_Seq: number;
	ManOF_NroPedidoCRM: string;
}

export interface IProcessManutOf {
	tenantId: string;
	orderId: string;
	orderIdERP: string;
	branchId: string;
	sourceCRM: string;
	statusCode: number;
	manutType: string;
	jsonCrm?: string;
	jsonErp?: string;
	createdAt: Date;
	updatedAt: Date;
	status: string;
}

export interface IRepoManutOf {
	generatedMaps?: Array<Object>;
	raw?: any;
	affected: number;
}
