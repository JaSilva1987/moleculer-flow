import { IAddress } from '../shared/address.interface';
import { IContact } from '../shared/contact.interface';

export interface IGetProviders {
	site: string;
	codigoDepositante: string;
	codigoFornecedor: string;
	cnpjCpf: string;
	razaoSocial: string;
	nomeFantasia: string;
	tipoDePessoa: string;
	inscricaoEstadual: string;
	enderecos: IAddress[];
	contatos: IContact[];
}

export interface IProviderData {
	site: string;
	codigoDepositante: string;
	codigoFornecedor: string;
	cnpjCpf: string;
	razaoSocial: string;
	nomeFantasia: string;
	tipoDePessoa: string;
	inscricaoEstadual: string;
	enderecos: IAddress;
	contatos: IContact;
}
