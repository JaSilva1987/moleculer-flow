import { differenceInSeconds } from 'date-fns';
import { AxiosRequestSimple } from '../../../../services/library/axios';
import {
	apmElasticConnect,
	loggerElastic
} from '../../../../services/library/elasticSearch';
import { IGetToken } from '../../../interface/erpProtheus/global';
import { ITokenProtheus } from '../../../interface/integration/token/tokenProtheus.interface';
import { ValidaTokenRepository } from '../../../repository/integration/token/tokenProtheus.repository';

export default class ValidaTokenController {
	public indexName = 'flow-integration-tokenprotheus';
	public serviceName = 'integration.tokenprotheus.service';
	public originLayer = 'integration';
	public repository = ValidaTokenRepository;

	public async validToken(urlHost: string) {
		return await this.validaExisteToken(urlHost);
	}

	async validaExisteToken(urlHost: string) {
		try {
			const validToken: any = await this.repository.GetTokenValid(
				urlHost
			);

			let messageToken: IGetToken = {
				token_type: 'Bearer',
				access_token: '',
				refresh_token: '',
				scope: 'default',
				expires_in: 3600
			};

			if (validToken.length > 0) {
				const difDate = differenceInSeconds(
					new Date(),
					validToken[0].createdAt
				);

				if (validToken[0].expireIn < difDate) {
					const getToken = await this.geraToken(urlHost);

					messageToken = getToken;
				} else {
					messageToken = {
						token_type: 'Bearer',
						access_token: validToken[0].token,
						refresh_token: validToken[0].refreshToken,
						scope: 'default',
						expires_in: validToken[0].expireIn
					};
				}
			} else {
				const getToken = await this.geraToken(urlHost);

				messageToken = getToken;
			}

			return messageToken;
		} catch (error) {
			loggerElastic(
				this.indexName,
				'499',
				this.originLayer,
				this.serviceName,
				JSON.stringify('Busca ordem com erros'),
				JSON.stringify(error.message)
			);
		}
	}

	async geraToken(urlHost: string) {
		try {
			apmElasticConnect.startTransaction('post-getTokenbyUrl', 'request');
			const response: any = await AxiosRequestSimple(urlHost, 'post');
			apmElasticConnect.endTransaction(response);

			const tokenMessage: ITokenProtheus = {
				urlHost: urlHost,
				token: response.message.access_token,
				refreshToken: response.message.refresh_token,
				createdAt: new Date(),
				expireIn: 3300
			};

			await this.repository.PostToken(tokenMessage);

			return response.message;
		} catch (error) {
			return error;
		}
	}
}
