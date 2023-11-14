export enum StatusFuncional {
	receivedOrigin = 'Recebido Integrador',
	ordersPending = 'Pendente',
	orderGenerated = 'Pedido Gerado',
	invoicedOrder = 'Pedido Faturado',
	orderTransit = 'Pedido em Trânsito',
	orderDelivered = 'Pedido Entregue',
	canceledOrder = 'Pedido Cancelado'
}

export enum StatusCodeFuncional {
	funcional_code = '201',
	funcional_codewarning = '452'
}

export enum TreatmentFuncional {
	inconsistency = 'Inconsistency in the return of Erp Protheus, please contact responsible Protheus',
	parameter_consult = 'Please enter valid parameters or consult globally',
	parameter_filter = 'One or more empty required parameters',
	funcional_json = 'Json in invalid format',
	message_funcional_throw = 'Order integration error',
	funcional_messagesucess = 'Order updated, in reprocess',
	funcional_messageupsucess = 'order updated, in reprocess',
	funcional_messagefail = 'The order already exists, please use method PUT',
	funcional_status = 'Success',
	funcional_statuswarning = 'Failure',
	funcional_groupid = 'Enter the groupId (01 Mafra or 99 Expressa).',
	error_routine = 'Error in the routine that sends to Protheus',
	funcional_messageput = 'There is no order to be updated',
	no_order = 'There are no orders to update',
	not_access = 'Erp Protheus Unavailable',
	protheusNull = 'There are no records in Erp Protheus to return'
}

export enum RouteApiFuncional {
	numberZero = 'global',
	numberOne = 'mafra',
	numberNinetyNine = 'expressa'
}
