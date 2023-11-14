import { IConditionings } from './conditionings.interface';

export interface IGetProducts {
	site: string;
	codigoDepositante: string;
	codigoProduto: string;
	descricaoProduto: string;
	descricaoComplementarProduto: string;
	unidadeDeMedida: string;
	codigoNcm: string;
	codigoBarras: string;
	familia: string;
	grupo: string;
	subGrupo: string;
	ativaControleDeDataDeValidade: boolean;
	ativaControleDeLote: boolean;
	ativaSeparacaoUnitizadorCompleto: boolean;
	ativaSeparacaoDePickingDinamico: boolean;
	ativaConferenciaDoProduto: boolean;
	importaRastro: boolean;
	shelfLifeEstoque: number;
	shelfLifeRecebimento: number;
	classeABC: string;
	lastro: number;
	camada: number;
	tipoDePeso: string;
	status: string;
	tipoDeProduto: string;
	unidadePadraoDeEstoque: string;
	quantidadePadraoDeEstoque: number;
	condicionamentos: IConditionings[];
}

export interface IProductData {
	site: string;
	codigoDepositante: string;
	codigoProduto: string;
	descricaoProduto: string;
	descricaoComplementarProduto: string;
	unidadeDeMedida: string;
	codigoNcm: string;
	codigoBarras: string;
	familia: string;
	grupo: string;
	subGrupo: string;
	ativaControleDeDataDeValidade: boolean;
	ativaControleDeLote: boolean;
	ativaSeparacaoUnitizadorCompleto: boolean;
	ativaSeparacaoDePickingDinamico: boolean;
	ativaConferenciaDoProduto: boolean;
	importaRastro: boolean;
	shelfLifeEstoque: number;
	shelfLifeRecebimento: number;
	classeABC: string;
	lastro: number;
	camada: number;
	tipoDePeso: string;
	status: string;
	tipoDeProduto: string;
	unidadePadraoDeEstoque: string;
	quantidadePadraoDeEstoque: number;
	ativaControleRastreabilidadeMedicamento: boolean;
	condicionamentos: IConditionings[];
}
