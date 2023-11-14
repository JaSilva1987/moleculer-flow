import { IStockPfsIntegration } from '../../../integration/stock/stockPfs.interface';

export interface IStockPfs {
	codigo_ean: string;
	armazem: string;
	data_movimento: string;
	data_validade: string;
	preco_bruto: number;
	saldo_lote: number;
	lote: string;
	sub_lote: string;
	data_fabricacao: string;
}

export interface ISendPfs {
	bodySendPfs: IStockPfs;
	registerPfs: IStockPfsIntegration;
}
