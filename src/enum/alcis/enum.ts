export enum EnumAlcis {
	busAlcis = 'Informacao recebida da fila do Alcis: ',
	recivedData = 'Dados recebidos e repassados para o processo de gravacao',
	recivedProcess = 'Dados recebidos e aguardando processamento no ERP Protheus',
	existProcess = 'Este pedido ja existe, por favor aguarde enquanto processamos...',
	existProcessUpdate = 'Pedido ja existente e atualizado, aguardando processamento no ERP Protheus',
	errUpdate = 'Pedido ja existe. Ocorreu um erro ao atualizar.',
	awaitProcess = 'Aguardando Integracao ERP Protheus',
	isIntegrate = 'Integrado ERP Protheus',
	notIntegrate = 'Erro ao Integrar ERP Protheus',
	awaitIntegration = 'Na Fila de Processamento ERP Protheus'
}
