export interface ITriangulationType {
	referencia: string;
	descricao: string;
	items: ITriangulationTypeItems[];
}

export interface ITriangulationTypeItems {
	passo: string;
	empresa_origem: string;
	filial_origem: string;
	local_origem: string;
	tes_inteligente: string;
	empresa_destino: string;
	filial_destino: string;
	local_destino: string;
	cnpj_destino: string;
}
