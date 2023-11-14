import { IAddress } from '../shared/address.interface';
import { IContact } from '../shared/contact.interface';

export interface IGetShippingCompany {
	site: string;
	codigoTransportadora: number;
	cnpjCpf?: number;
	razaoSocial?: string;
	nomeFantasia?: string;
	tipoDePessoa?: string;
	inscricaoEstadual?: number;
	enderecos?: IAddress[];
	contatos?: IContact[];
}

export interface IShippingCompanyData {
	site: string;
	codigoTransportadora: string;
	cnpjCpf?: string | null;
	razaoSocial?: string | null;
	nomeFantasia?: string | null;
	tipoDePessoa: string;
	inscricaoEstadual?: string | null;
	enderecos?: IAddress;
	contatos?: IContact;
}
