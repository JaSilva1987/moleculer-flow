import { ServiceBroker } from 'moleculer';
import { connectionCrmIso } from '../../../data-source';
import { MacroIsoPvTransacaoCartaoEntity } from '../../../entity/crmIso/vwMacroTransacaoCartao.entity';

let broker: ServiceBroker;

export const PostCheckCardPayments = connectionCrmIso
	.getRepository(MacroIsoPvTransacaoCartaoEntity)
	.extend({
		async GetOnePaymentCard(
			ZPT110_ZPT_FILIAL: number,
			ZPT110_ZPT_NUM: number
		) {
			try {
				const checkPaymentsCard = await this.findOne({
					where: { ZPT110_ZPT_FILIAL, ZPT110_ZPT_NUM }
				});

				if (checkPaymentsCard == undefined || null || '') {
					return 'Sem dados';
				} else {
					return checkPaymentsCard;
				}
			} catch (error) {
				broker.logger.warn('====> GetOnePaymentCard error: ' + error);
			}
		},

		async GetPaymentCard() {
			try {
				const checkPaymentsCard = ([] = await this.find());

				if (checkPaymentsCard == undefined || null || '') {
					return 'Sem dados de pagamento';
				} else {
					return checkPaymentsCard;
				}
			} catch (error) {
				broker.logger.warn('====> GetPaymentCard error: ' + error);
			}
		}
	});
