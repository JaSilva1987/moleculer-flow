'use strict';

import {
	Service as MoleculerService,
	ServiceBroker,
	ServiceSchema
} from 'moleculer';
import { Event, Service } from 'moleculer-decorators';
import moment from 'moment';
import {
	IIIPaymentsOrders,
	IPaymentCrmIso
} from '../../../src/interface/crmIso/payment/paymentCrmIso.interface';
import { PostCheckCardPayments } from '../../../src/repository/crmIso/payments/checkCardPayments.repository';
import { apmElasticConnect, loggerElastic } from '../../library/elasticSearch';

@Service({
	name: 'service.crmiso.payments',
	group: 'flow-cremmer'
})
export default class PaymentsCrmIsoService extends MoleculerService {
	public allPoolQueryCrmOrders: any;
	public indexName = 'flow-integration-routeorders';
	public serviceName = 'PaymentsCrmIsoService';
	public originLayer = 'crmiso';
	public checkPaymentCart: Array<IPaymentCrmIso>;

	public constructor(public broker: ServiceBroker, schema: ServiceSchema) {
		super(broker);
	}

	@Event({
		name: 'flow-crmiso-payments',
		group: 'flow-cremmer'
	})
	public async PoolQueryCrmPayments(ctx: any) {
		this.logger.info(
			'================> INICIO BUSCA PAGAMENTOS <================'
		);
		try {
			this.checkPaymentCart =
				await PostCheckCardPayments.GetPaymentCard();

			for (const payment of this.checkPaymentCart) {
				if (payment.ZPT110_ZPT_VALOR > 0) {
					const resultPayment: IIIPaymentsOrders = {
						cNumPed: payment.ZPT110_ZPT_NUM.toString().padStart(
							8,
							'0'
						),
						cCodCTR: payment.ZPT110_ZPT_CODCTR.trim(),
						cPDV: payment.ZPT110_ZPT_PDV.trim(),
						cNSU: payment.ZPT110_ZPT_NSU.trim(),
						cNSUHost: payment.ZPT110_ZPT_NSUHST.trim(),
						cData: moment(payment.ZPT110_ZPT_DATA.trim()).format(
							'YYYY-MM-DD'
						),
						cHora: payment.ZPT110_ZPT_HORA.trim(),
						cCNPJ: payment.ZPT110_ZPT_CNPJC.trim(),
						nTaxa: payment.ZPT110_ZPT_TAXA,
						nValor: payment.ZPT110_ZPT_VALOR,
						nBandeira: payment.ZPT110_ZPT_BANDEI
					};

					await this.broker.broadcast(
						'flow-crmiso-integration-payments',
						resultPayment
					);

					loggerElastic(
						this.indexName,
						'200',
						this.originLayer,
						this.serviceName,
						JSON.stringify(payment),
						JSON.stringify(resultPayment)
					);

					return resultPayment;
				}
			}
		} catch (error) {
			loggerElastic(
				this.indexName,
				'499',
				this.originLayer,
				this.serviceName,
				JSON.stringify(this.checkPaymentCart),
				JSON.stringify(error.message)
			);
			apmElasticConnect.captureError(new Error(error.message));
		}
	}
}
