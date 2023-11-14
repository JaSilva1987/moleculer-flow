import { format, sub } from 'date-fns';
import { ServiceBroker } from 'moleculer';
import { Between } from 'typeorm';
import { connectionCrmIso } from '../../../data-source';
import { ConfigLogEntity } from '../../../entity/crmIso/configLob.entity';
import { IConfigLogCrmIso } from '../../../interface/crmIso/config/configLog.interface';

let broker: ServiceBroker;

export const ConfigLogRepository = connectionCrmIso
	.getRepository(ConfigLogEntity)
	.extend({
		async GetLog(getMessage: IConfigLogCrmIso) {
			try {
				const startDate = format(
					sub(new Date(), { seconds: 90 }),
					'yyyy-MM-dd HH:mm:ss'
				);

				const endDate = format(new Date(), 'yyyy-MM-dd HH:mm:ss');

				return await this.findOne({
					where: {
						orderId: getMessage.orderId,
						name: getMessage.name,
						status: getMessage.status,
						dateTimeSav: Between(
							new Date(startDate),
							new Date(endDate)
						)
					}
				});
			} catch (error) {
				broker.logger.warn('====> PostLog Iso error: ' + error);
			}
		},

		async PostLog(postMessage: IConfigLogCrmIso) {
			try {
				return await this.createQueryBuilder()
					.insert()
					.into(ConfigLogEntity)
					.values(postMessage)
					.execute();
			} catch (error) {
				broker.logger.warn('====> PostLog Iso error: ' + error);
			}
		}
	});
