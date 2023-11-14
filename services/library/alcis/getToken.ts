import axios from 'axios';
import { ITokenHeader } from '../../../src/interface/alcis/shared/tokenHeader.interface';
import { IGetTokenError } from '../../../src/interface/gko/global/getTokenGko.interface';
import { loggerElastic } from '../elasticSearch';

async function getToken(tokenAlias: string) {
	const tokenHeaders: ITokenHeader = {
		Alias: tokenAlias,
		Username: process.env.ALCIS_TOKEN_USERNAME,
		Password: process.env.ALCIS_TOKEN_PASSWORD
	};

	const requestConfig = {
		headers: {
			...tokenHeaders,
			'Content-Type': 'application/json'
		},
		timeout: 200000
	};
	try {
		let tokenRequestResult = await axios.post(
			process.env.ALCIS_BASE_URL + process.env.ALCIS_TOKEN_API!,
			'',
			requestConfig
		);

		return tokenRequestResult.data;
	} catch (error) {
		loggerElastic(
			'flow-alcis-get-token',
			String(error.status || 500),
			'alcis',
			'alcis-token-library',
			JSON.stringify(
				`get - ${
					process.env.ALCIS_BASE_URL + process.env.ALCIS_TOKEN_API
				}`
			),
			JSON.stringify(error)
		);

		let errorGetTokenAlcis: IGetTokenError = {
			message:
				'Erro ao recolher o Token Alcis, a API alcis não respondeu',
			code: error?.status || error?.response?.status || 500,
			errorBody: {
				data: error?.response?.data || error?.data,
				requestLink: process.env.ALCIS_TOKEN_API!
			}
		};

		throw errorGetTokenAlcis;
	}
}

export { getToken };
