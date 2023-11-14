export const requestOrderSaleSchema = {
	tipo_triangulacao: { type: 'string', min: 3, max: 10 },
	num_pedido: { type: 'string', min: 1, max: 30 },
	cliente: { type: 'string', min: 1, max: 18 },
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
