import { INewConfirmationOrderItems } from './items.interface';

export interface INewConfirmationOrder {
	site: string;
	codigoDepositante: string;
	numeroPedido: string;
	subPedido: number;
	numeroCarga?: number;
	codigoTransportadora?: string;
	codigoCliente?: string;
	tipoDePedido?: string;
	dataHoraReal?: string;
	placaVeiculo?: string;
	quantidadeVolumes?: number;
	pesoTotal?: number;
	itens?: INewConfirmationOrderItems[];
}

export interface IOrderConfirmation {
	site: string;
	codigoDepositante: string;
	numeroPedido: string;
	subPedido: number;
	idIntegracao?: string | null;
	controller?: string | null;
	Conf_ERP?: string | null | undefined;
}
