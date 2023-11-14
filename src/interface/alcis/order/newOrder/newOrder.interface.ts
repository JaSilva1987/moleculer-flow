import { INewOrderItems } from './items.interface';

export interface INewOrder {
	site: string;
	codigoDepositante: string;
	numeroPedido: string;
	subPedido: number;
	idIntegracao?: string | null;
	numeroCarga?: string | null;
	codigoTransportadora: string;
	dataDoPedidoPrevisto: string;
	codigoCliente: string;
	deposito?: string | null;
	area?: string | null;
	endereco?: string | null;
	sequenciaDeEntrega?: number | null;
	tipoDePedido: string;
	prioridade?: number | null;
	valorTotal?: number | null;
	moeda?: string | null;
	rota?: string | null;
	itens: INewOrderItems[];
}
