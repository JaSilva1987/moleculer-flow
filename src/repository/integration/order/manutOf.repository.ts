import { Errors } from 'moleculer';
import { connectionIntegrador } from '../../../data-source';
import { ManutOfEntity } from '../../../entity/integration/manutof.entity';
import { StatusManutOf } from '../../../enum/crmIso/enum';
import {
	IProcessManutOf,
	IUpdateManutOf
} from '../../../interface/crmIso/orderFat/updateManutOf.interface';

export const IntegradorManutOfRepository = connectionIntegrador
	.getRepository(ManutOfEntity)
	.extend({
		async PostManutOf(ctxMessage: IProcessManutOf) {
			try {
				await this.manager.transaction(
					async (transactionalEntityManager: {
						save: (
							arg0: typeof ManutOfEntity,
							arg1: IProcessManutOf
						) => any;
					}) => {
						await transactionalEntityManager.save(
							ManutOfEntity,
							ctxMessage
						);
					}
				);
			} catch (error) {
				throw new Errors.MoleculerRetryableError(error.message, 100);
			}
		},

		async GetManutOf(setStatus: string) {
			try {
				const checkManut: Array<object> = await this.find({
					where: { status: setStatus }
				});

				return checkManut;
			} catch (error) {
				throw new Errors.MoleculerRetryableError(error.message, 100);
			}
		},

		async PutManutOf(message: IUpdateManutOf) {
			try {
				await this.manager.transaction(
					async (transactionalEntityManager: {
						update: (
							arg0: typeof ManutOfEntity,
							arg1: Object,
							arg2: Object
						) => any;
					}) => {
						await transactionalEntityManager.update(
							ManutOfEntity,
							{
								tenantId: '11',
								orderId: message.ManOF_NroPedidoCRM,
								orderIdERP: message.ManOF_OFNro,
								branchId: message.ManOF_Filial,
								sourceCRM: 'ISOCRM'
							},
							{
								status: StatusManutOf.ProcessedIso
							}
						);
					}
				);
			} catch (error) {
				throw new Errors.MoleculerRetryableError(error.message, 100);
			}
		}
	});
