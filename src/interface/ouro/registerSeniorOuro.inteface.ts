export interface IRegisterSeniorOuro {
	ConsumidorFinal: string;
	CPF: string;
	CodigoIntegracao: string;
	Grupo: string;
	Subgrupo: string;
	Atividade: string;
	Nome: string;
	RG: string;
	Sexo: string;
	CEP: string;
	Endereco: string;
	Complemento: string;
	NumeroEndereco: string;
	Bairro: string;
	Cidade: string;
	Estado: string;
	Pais: string;
	Fone1: string;
	Fone2: string;
	Celular: string;
	Email: string;
	EmailNFe: string;
	LimiteCredito: string;
	Classificação: string;
	IndicadorIE: string;
}

export interface TRegisterSeniorOuro {
	status: number;
	message: object;
}
