export interface IItemRequestPfs {
	produto: string;
	quantidade: number;
	preco_unitario: number;
	tipo_saida: string;
	preco_fabrica_atual?: number;
	valor_total: number;
	perc_rentabil?: number;
	codigo_fiscal: string;
	armazem?: string;
	fabricante?: string;
}

export interface IRequestPfs {
	tipo_pedido: string;
	cliente: string;
	num_pedido: string;
	loja_entrega?: string;
	loja?: string;
	tipo_cliente?: string;
	mensagem_nota: string;
	nat_operacao: number;
	natureza?: string;
	cond_pagamento?: string;
	items: [IItemRequestPfs];
}
