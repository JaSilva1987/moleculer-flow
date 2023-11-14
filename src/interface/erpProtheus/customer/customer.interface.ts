export interface ICustomerData {
	CodigoCliente?: string;
	Loja: string;
	RazaoSocial: string;
	NomeFantasia: string;
	Endereco: string;
	Cidade: string;
	Estado: string;
	CEP: string;
	Bairro: string;
	DDD: string;
	Telefone: string;
	Fax: string;
	'E-mail': string;
	Atividade: string;
	CodigoVendedor: string;
	EnderecoCobranca: string;
	BairroCobranca: string;
	CEPCobranca: string;
	MunicipioCobranca: string;
	EstadoCobranca: string;
	ConsumidorFinal: string;
	ContribuinteICMS: string;
	TipoCliente: string;
	DescTipoCliente: string;
	TipoPessoa: string;
	CNPJ?: string;
	CPF?: string;
	RG: string;
	IE: string;
	Suframa: string;
	Nicho: string;
	SubNicho: string;
	CodigoSetor: string;
	CodClassificacao: string;
	DescClassificacao: string;
	CodEspecialidade: string;
	DescEspecialidade: string;
	CodSegmento: string;
	DescSegmento: string;
	CodResponsavel: string;
	DescResponsavel: string;
	CodCanal: string;
	DescCanal: string;
	Latitude: string;
	Longitude: string;
	PrioridadeCliente: string;
	TipoFrete: string;
	CodTranspPadrao: string;
	CodTabelaPreco: string;
	CodPagamento: string;
	DescCondPagamento: string;
	Natureza: string;
	CodRegCliente: string;
	RegiaoCliente: string;
	EmitirBoleto: string;
	DtNascimento: string;
	DtCadastro: string;
	HrCadastro: string;
	FilialGestao: string;
	UsaTagInfadProd: string;
	CodClieCorporativo: string;
	LojaCorporativo: string;
	ContCorporativo: string;
	CodClienteCRM: string;
	PrazoMedio: number;
	ValorLimite: number;
	DataVencLimite: string;
	CodProspect: string;
	TipoLotCliente: string;
	ClieUsaTransp: string;
	CodClienteLX: string;
	CodClienteISOCRM: string;
	ExigeCxFechada: string;
	AceitaFtParcial: string;
	QtdAlocacaoEstoque: string;
	Ativo: string;
	DtInclusao: string;
	DtAlteracao: string;
	GrpCliente: string;
	IBGE: string;
	DiasProtesto: number;
	ResponsavelClie: string;
	CodPais: string;
	NomePais: string;
	'E-mailNPS': string;
	TelefoneNPS: string;
	ContatoNPS: string;
	ResponsavelNPS: string;
	HrAlteracao: string;
	CodClieRemessa: string;
	LojaRemessa: string;
	DtVencRegEspecial: string;
	StatusRegEspecial: string;
	Complemento: string;
	DescNicho: string;
	DescSubNicho: string;
	DestacaIE: string;
	DescSuframa: string;
	RecINSS: string;
	RecCOFINS: string;
	RecCSLL: string;
	RecPIS: string;
	RecIRRF: string;
	SimplesNacional: string;
	ConsReceita: string;
	ConsSintegra: string;
	ConsSuframa: string;
	PISCOFREP: string;
	UltimaConsSuframa: string;
	SituacaoSuframaHoje: string;
	SitSuframaUltimaConsulta: string;
}

export interface ICustomerDataSimple {
	CodigoCliente?: string;
	name: string;
	fantasyName: string;
	address: string;
	person: 'F' | 'J';
	state: string;
	city: string;
	district: string;
	zipCode: string;
	ddd: string;
	phone: string;
	cpf: string;
	email: string;
	codeEcommerce: string;
	store?: string;
	country?: string;
	codCountry?: string;
	type?: string;
	ticket?: string;
	account?: string;
	seller?: string;
	pharmacy?: string;
	niche?: string;
	subNiche?: string;
	customerActivity?: string;
	category?: string;
	codeCRM?: string;
	codeCorporate?: string;
	storeCorporate?: string;
	codeLX?: string;
	codeISOCRM?: string;
	codeShipping?: string;
	storeShipping?: string;
	block?: string;
	taxGroup?: string;
	highlightSE?: string;
	collectISS?: string;
	typePerson?: string;
	calculateINSS?: string;
	customerSegment?: string;
	customerClassification?: string;
	customerResponsible?: string;
}

export interface IPostCustomer {
	customer: ICustomerDataSimple[];
}