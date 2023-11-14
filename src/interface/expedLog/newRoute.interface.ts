export interface INewRouteExpedLog {
	cnpjEmpresa: string;
	cnpjFilial: string;
	numero: string;
	rotadestino: string;
	rotanome: string;
	data: string;
	regiao: string;
	transportadora: INewRouteShippingCompany;
	motorista: INewRouteDriver;
	base: INewRouteBase;
	limites: INewRouteLimit;
	tipoRota: string;
	tipoMaterial: string;
	fornecimento: string;
	tipoFrete: string;
	paradas: Array<INewRouteStop>;
}

export interface INewRouteShippingCompany {
	codigo: string;
	razao: string;
}

export interface INewRouteDriver {
	usuario: string;
	placaVeiculo: string;
}

export interface INewRouteBase {
	origem: {
		codigo: string;
		nome: string;
		rua: string;
		numero: string;
		complemento: string;
		bairro: string;
		cidade: string;
		estado: string;
		cep: string;
		pais: string;
		codigoIBGE: string;
	};
	destino: {
		codigo: string;
		nome: string;
		rua: string;
		numero: string;
		complemento: string;
		bairro: string;
		cidade: string;
		estado: string;
		cep: string;
		pais: string;
		codigoIBGE: string;
	};
}

export interface INewRouteLimit {
	inicio: string;
	fim: string;
}

export interface INewRouteStop {
	numero: string;
	documento: {
		chaveNota: string;
	};
}
