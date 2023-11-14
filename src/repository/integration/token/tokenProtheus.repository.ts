import { Errors } from 'moleculer';
import { connectionIntegrador } from '../../../data-source';
import { TokenProtheusEntity } from '../../../entity/integration/tokenProtheus.entity';
import { ITokenProtheus } from '../../../interface/integration/token/tokenProtheus.interface';

export const ValidaTokenRepository = connectionIntegrador
	.getRepository(TokenProtheusEntity)
	.extend({
		async GetTokenValid(urlHost: string): Promise<ITokenProtheus> {
			try {
				const getToken = await this.find({
					where: { urlHost },
					order: { id: 'DESC' },
					take: 1
				});

				return getToken;
			} catch (error) {
				console.log(error);
			}
		},

		async PostToken(message: ITokenProtheus) {
			try {
				const postMessage = await this.createQueryBuilder()
					.insert()
					.into(TokenProtheusEntity)
					.values(message)
					.execute();

				return postMessage;
			} catch (error) {
				throw new Errors.MoleculerRetryableError(
					error.message,
					error.code
				);
			}
		}
	});
