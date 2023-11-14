'use strict';

import {
	Service as MoleculerService,
	ServiceBroker,
	ServiceSchema
} from 'moleculer';
import { Event, Service } from 'moleculer-decorators';
import { StatusIntegrador } from '../../../src/enum/integrador/enum';
import {
	IIIPaymentsOrders,
	OfPayemnt
} from '../../../src/interface/crmIso/payment/paymentCrmIso.interface';
import { ISaveOrders } from '../../../src/interface/integration/order';
import { SaveOrdersCrmIsoRepository } from '../../../src/repository/integration/order/orders.repository';
import { apmElasticConnect, loggerElastic } from '../../library/elasticSearch';

@Service({
	name: 'service.crmiso.integration.payments',
	group: 'flow-cremmer'
})
export default class PaymentsCrmIsoService extends MoleculerService {
	public allPoolQueryCrmOrders: any;
	public indexName = 'flow-integration-routeorders';
	public serviceName = 'PaymentsCrmIsoService';
	public originLayer = 'integration';

	public constructor(public broker: ServiceBroker, schema: ServiceSchema) {
		super(broker);
	}

	@Event({
		name: 'flow-crmiso-integration-payments',
		group: 'flow-cremmer'
	})
	public async PoolQueryCrmPayments(ctxMessage: IIIPaymentsOrders) {
		this.logger.info(
			'================> RECEBENDO DADOS PARA PAGAMENTO NO INTEGRADOR <================'
		);
		try {
			const checkDatabase: ISaveOrders = {
				tenantId: '11',
				orderId: ctxMessage.cNumPed,
				sourceCRM: 'ISOCRM',
				status: StatusIntegrador.generateOrder
			};

			const checkPayment = await SaveOrdersCrmIsoRepository.GetPayment(
				checkDatabase
			);

			const oderPed = checkPayment?.orderId ?? 0;

			if (oderPed === ctxMessage.cNumPed) {
				const updatePayment: OfPayemnt = {
					cNumOF: checkPayment.orderIdERP,
					lPagamento: false,
					aPagamentos: [
						{
							cCodCTR: ctxMessage.cCodCTR,
							nSeq: 1,
							cPDV: ctxMessage.cPDV,
							cNSU: ctxMessage.cNSU,
							cNSUHost: ctxMessage.cNSUHost,
							cData: ctxMessage.cData,
							cHora: ctxMessage.cHora,
							cCNPJ: ctxMessage.cCNPJ,
							nTaxa: ctxMessage.nTaxa,
							nValor: ctxMessage.nValor,
							nBandeira: ctxMessage.nBandeira
						}
					],
					aItemPedido: [
						{
							cItemOF: '01'
						}
					]
				};

				const mountOfUpdate = {
					updatePayment: { OF: [updatePayment] },
					tenantId: checkPayment.tenantId,
					branchId: checkPayment.branchId,
					orderId: checkPayment.orderId,
					orderIdERP:
						checkPayment.orderIdERP !== undefined
							? checkPayment.orderIdERP
							: ' '
				};

				await this.broker.broadcast(
					'flow-crmiso-protheus-payments',
					mountOfUpdate
				);

				loggerElastic(
					this.indexName,
					'200',
					this.originLayer,
					this.serviceName,
					JSON.stringify(checkPayment),
					JSON.stringify(mountOfUpdate)
				);
			}
		} catch (error) {
			loggerElastic(
				this.indexName,
				'499',
				this.originLayer,
				this.serviceName,
				JSON.stringify(ctxMessage),
				JSON.stringify(error.message)
			);
			apmElasticConnect.captureError(new Error(error.message));
		}
	}
}
