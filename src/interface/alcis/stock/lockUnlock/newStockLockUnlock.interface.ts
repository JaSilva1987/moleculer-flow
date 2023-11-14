export interface IStockLockUnlock {
	site?: string;
	codigoDepositante?: string;
	codigoProduto?: string;
	quantidadeBloqueioDesbloqueio?: number;
	lote?: null;
	serial?: null;
	indicador?: string;
	motivoBloqueioDesbloqueioOrigem?: string;
	codigoMotivoOrigem?: string;
	motivoBloqueioDesbloqueioDestino?: string;
	codigoMotivoDestino?: string;
	ordemRecebimento?: null;
	idIntegracao?: null;
}

export interface IStockLockUnlockNotification {
	site: string;
	numeroDaTransacao: number;
	idIntegracao?: string | null;
	controller: string;
}
