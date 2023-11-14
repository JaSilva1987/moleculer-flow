export enum StatusIntegrador {
	receivedOrigin = 'Recebido Integrador',
	consumerValid = 'Validacao Consumer',
	productValid = 'Validacao Produto',
	generateOrder = 'Gerado Ordem',
	awaitProcess = 'Aguardando Processamento',
	integrateProtheus = 'Integrado Protheus',
	errorProtheus = 'Erro Protheus',
	returnInvalid = 'Retorno Protheus Invalido',
	retryProtheus = 'Retry Protheus',
	inReorder = 'Refazer Pedido',
	updatePayment = 'Gerado Pagamento',
	retryPayment = 'Retry Pagamento'
}

export enum StatusIntegradorFuncional {
	updateOrder = 'Atualizacao de Ordem',
	errorMoney = 'Erro Money',
	successMoney = 'Sucesso Money'
}
