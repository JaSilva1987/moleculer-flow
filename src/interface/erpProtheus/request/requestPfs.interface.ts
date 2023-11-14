import { IRequestPfsIntegration } from '../../integration/request/requestPfs.interface';

export interface IItemRequestPfsProtheus {
	produto: string;
	quantidade: number;
	preco_unitario: number;
}

export interface IRequestPfsProtheus {
	tipoID: string;
	cnpj_cliente: string;
	mensagemnota: string;
	nat_operacao: string;
	items: IItemRequestPfsProtheus[];
}

export interface ISendRequestPfsProtheus {
	bodySend: IRequestPfsProtheus;
	register: IRequestPfsIntegration;
}
