import {
	ServiceBroker,
	Service as MoleculerService,
	ServiceSchema
} from 'moleculer';
import { IConditionPayments } from '../../../../interface/integration/payment/paymentCondition.interface';
import PaymentConditionController from '../../../integration/payment/paymentCondition.controller';
import { VIPaymentConditionFlow } from '../../../../interface/erpProtheus/payment/paymentCondition.interface';
import {
	apmElasticConnect,
	loggerElastic
} from '../../../../../services/library/elasticSearch';

export default class erpProtheusPaymentConditionController extends MoleculerService {
	public constructor(public broker: ServiceBroker, schema: ServiceSchema) {
		super(broker);
	}
	public indexName = 'flow-erpprotheus-getpaymentconditionflow';
	public serviceName = 'getPaymentConditionController';
	public originLayer = 'erpprotheusviveo';

	public async validateSavePayment(request: IConditionPayments) {
		try {
			const postPaymentCode = new PaymentConditionController(request);

			postPaymentCode.PostPaymentCode(request);
		} catch (error) {
			loggerElastic(
				this.indexName,
				'499',
				this.originLayer,
				this.serviceName,
				JSON.stringify(error.message)
			);

			apmElasticConnect
				.setTransactionName(this.indexName)
				.captureError(new Error(error.message))
				.endTransaction();
		}
	}
}
