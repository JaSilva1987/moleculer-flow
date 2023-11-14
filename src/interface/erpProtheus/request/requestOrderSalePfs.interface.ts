import { IRequestOrderSalePfsIntegration } from '../../integration/request/requestOrderSalePfs.interface';

export interface IItemRequestOrderSalePfsProtheus {
	produto: string;
	quantidade: number;
	valor_unitario: number;
}

export interface IRequesOrderSaletPfsProtheus {
	tipo_triangulacao: string;
	cnpj_fornecedor: string;
	items: IItemRequestOrderSalePfsProtheus[];
}

export interface ISendRequestOrderSalePfsProtheus {
	bodySend: IRequesOrderSaletPfsProtheus;
	register: IRequestOrderSalePfsIntegration;
}
