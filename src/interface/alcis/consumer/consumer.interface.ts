// Para atributos não utilizados, deve ser enviado null. Ex.: "NomeAtributo": null.

import { IAddress } from '../shared/address.interface';
import { IContact } from '../shared/contact.interface';

interface IGetConsumers {
	site: string;
	codigoDepositante: number;
	codigoCliente: number;
	cnpjCpf: number;
	razaoSocial: string;
	nomeFantasia: string;
	tipoDePessoa: number;
	inscricaoEstadual: number;
	enderecos: IAddress[];
	contatos: IContact[];
}

interface IConsumerData {
	site: string;
	codigoDepositante: number;
	codigoCliente: number;
	cnpjCpf?: number;
	razaoSocial?: string;
	nomeFantasia?: string;
	tipoDePessoa: number;
	inscricaoEstadual?: number;
	enderecos?: IAddress;
	contatos?: IContact;
}

export { IGetConsumers, IConsumerData };
