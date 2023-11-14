import { ServiceBroker } from 'moleculer';
import { connectionCrmIso } from '../../../data-source';
import { ManutOfsEntity } from '../../../entity/crmIso/tbManutOfs.entity';
import { IUpdateManutOf } from '../../../interface/crmIso/orderFat/updateManutOf.interface';
import { IntegradorManutOfRepository } from '../../integration/order/manutOf.repository';

let broker: ServiceBroker;

export const UpdateManutOfRepository = connectionCrmIso
	.getRepository(ManutOfsEntity)
	.extend({
		async UpdateCrmIsoManutOf(message: IUpdateManutOf) {
			try {
				const crmIsoUpdateManutOf = await this.createQueryBuilder()
					.update(ManutOfsEntity)
					.set({
						ManOF_Processado: message.ManOF_Processado,
						ManOF_DHProc: new Date(message.ManOF_DHProc)
					})
					.where(
						'ManOF_Filial = :ManOF_Filial AND ManOF_OFNro = :ManOF_OFNro  AND ManOF_NroPedidoCRM = :ManOF_NroPedidoCRM AND ManOF_Seq = :ManOF_Seq',
						{
							ManOF_Filial: message.ManOF_Filial,
							ManOF_OFNro: message.ManOF_OFNro,
							ManOF_NroPedidoCRM: message.ManOF_NroPedidoCRM,
							ManOF_Seq: message.ManOF_Seq
						}
					)
					.execute();

				if (crmIsoUpdateManutOf.affected > 0) {
					await IntegradorManutOfRepository.PutManutOf(message);
				}

				return crmIsoUpdateManutOf;
			} catch (error) {
				broker.logger.warn('====> UpdateCrmIsoManutOf error: ' + error);
			}
		}
	});
