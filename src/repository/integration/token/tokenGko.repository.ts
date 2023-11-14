import { Errors } from 'moleculer';
import { TokenEntity } from '../../../entity/integration/token.entity';
import { getToken } from '../../../../services/library/gko';
import { connectionIntegrador, flow } from '../../../data-source';

export const ValidTokenRepository = connectionIntegrador
	.getRepository(TokenEntity)
	.extend({
		async GetValidToken(): Promise<TokenEntity> {
			try {
				const gkoValidToken = await this.findOne({
					where: { statusToken: 200 }
				});

				if (!gkoValidToken) throw 'Nenhum token encontrado';

				return gkoValidToken;
			} catch (error) {
				let newToken = await getToken();

				const gkoValidToken = await this.save({
					token: String(newToken),
					tokenSystem: 'gko',
					statusToken: 200,
					createdAt: new Date(),
					updatedAt: null,
					lifeTime: null
				});

				return gkoValidToken;
			}
		},

		async updateTokenStatus(
			tokenId: number,
			tokenSystemReceived: string
		): Promise<TokenEntity> {
			try {
				const tokenUsed = await this.findOne({
					where: { id: tokenId }
				});

				const createdTime: number = new Date(
					tokenUsed.createdAt
				).getTime();
				const tokenLifeTime =
					Math.floor(new Date().getTime() - createdTime) / 1000;

				const result = await this.createQueryBuilder()
					.update(TokenEntity)
					.set({
						statusToken: 400,
						updatedAt: new Date(),
						lifeTime: String(tokenLifeTime) + 's'
					})
					.where('id = :id', {
						id: tokenId
					})
					.andWhere('tokenSystem = :tokenSystem', {
						tokenSystem: tokenSystemReceived
					})
					.execute();

				const newToken = await this.GetValidToken();

				return;
			} catch (error) {
				let errorResponse = {
					errorBody: error,
					message: 'Erro ao atualizar status do token'
				};
				return;
			}
		}
	});
