export const requestSchema = {
	tipo_pedido: { type: 'string', min: 1, max: 1 },
	num_pedido: { type: 'string', min: 1, max: 30 },
	cliente: { type: 'string', min: 1, max: 18 },
	mensagem_nota: { type: 'string', min: 3, max: 255 },
	nat_operacao: { type: 'number', integer: true },
	items: {
		type: 'array',
		items: {
			type: 'object',
			props: {
				produto: { type: 'string', min: 1, max: 20 },
				quantidade: {
					type: 'number',
					positive: true,
					integer: true
				},
				preco_unitario: { type: 'number', positive: true }
			}
		}
	}
};
