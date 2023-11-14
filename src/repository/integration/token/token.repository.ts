import { getToken as getAlcisToken } from '../../../../services/library/alcis';
import { getToken } from '../../../../services/library/gko';
import { connectionIntegrador } from '../../../data-source';
import { TokenEntity } from '../../../entity/integration/token.entity';

export const ValidTokenRepository = connectionIntegrador
	.getRepository(TokenEntity)
	.extend({
		async GetValidToken(tokenSystem: string): Promise<TokenEntity> {
			try {
				const validToken = await this.findOne({
					where: { statusToken: 200, tokenSystem }
				});

				if (!validToken) {
					throw new Error('Nenhum token encontrado');
				}

				return validToken;
			} catch (error) {
				const mafraAlias = process.env.ALCIS_TOKEN_ALIAS_MAFRA;
				const cremerAlias = process.env.ALCIS_TOKEN_ALIAS_CREMER;
				let newToken;

				switch (tokenSystem) {
					case 'gko':
						newToken = await getToken();
						break;
					case mafraAlias:
					case cremerAlias:
						newToken = await getAlcisToken(tokenSystem);
						break;
					default:
						break;
				}

				if (typeof newToken === 'object') {
					throw newToken;
				}

				const validToken = await this.save({
					token: String(newToken),
					tokenSystem,
					statusToken: 200,
					createdAt: new Date(),
					updatedAt: null,
					lifeTime: null
				});

				return validToken;
			}
		},

		async updateTokenStatus(
			tokenId: number,
			tokenSystemReceived: string
		): Promise<void> {
			try {
				const tokenUsed = await this.findOne({
					where: { id: tokenId, tokenSystem: tokenSystemReceived }
				});

				const createdTime: number = tokenUsed.createdAt.getTime();
				const tokenLifeTime = Math.floor(
					(new Date().getTime() - createdTime) / 1000
				);

				await this.createQueryBuilder()
					.update(TokenEntity)
					.set({
						statusToken: 400,
						updatedAt: new Date(),
						lifeTime: `${tokenLifeTime}s`
					})
					.where('id = :id', { id: tokenId })
					.andWhere('tokenSystem = :tokenSystem', {
						tokenSystem: tokenSystemReceived
					})
					.execute();

				await this.GetValidToken(tokenSystemReceived);
			} catch (error) {
				let errorResponse = {
					errorBody: error,
					message: 'Erro ao atualizar status do token'
				};
				throw errorResponse;
			}
		}
	});
