import { AxiosRequestComplete } from '../../../../services/library/axios';
import { loggerElastic } from '../../../../services/library/elasticSearch';
import { ValidTokenRepository } from '../../../repository/integration/token/token.repository';

const findAlcisAlias = (body: any, params: object | null) => {
	if (!body && !params) {
		throw new Error('Site não informado');
	}

	let { site } = params || body;
	if (!site) {
		throw new Error('Site não informado');
	}

	let designatedAlias = site?.charAt(0);

	if (isNaN(Number(designatedAlias))) {
		if (designatedAlias === 'M') {
			return process.env.ALCIS_TOKEN_ALIAS_MAFRA;
		}
	}

	return process.env.ALCIS_TOKEN_ALIAS_CREMER;
};

export async function alcisRequestController(
	urlSend: string,
	bodySend: any,
	nameToken: string,
	methodAxios: 'get' | 'post' | 'put',
	paramName?: string,
	paramsValue?: string,
	routineName?: string,
	multipleHeaders?: object | null,
	multipleParams?: object | null
) {
	try {
		const tokenAlias = findAlcisAlias(bodySend, multipleParams);

		const tokenRequest = await ValidTokenRepository.GetValidToken(
			tokenAlias
		);

		const alcisToken = tokenRequest.token;

		const response = await AxiosRequestComplete(
			urlSend,
			bodySend,
			nameToken,
			'Bearer ' + alcisToken,
			methodAxios,
			paramName,
			paramsValue,
			routineName,
			multipleHeaders,
			multipleParams
		);

		loggerElastic(
			'flow-alcis-controller',
			String(response?.status),
			'flow-alcis-controller',
			'flow-alcis-controller',
			JSON.stringify(urlSend),
			JSON.stringify(
				response || { erro: 'Response do controller veio vazia' }
			)
		);

		if (+response.status >= 400) {
			throw response;
		}

		return response;
	} catch (err) {
		if (+err?.status !== 401) {
			throw err;
		}

		try {
			const tokenAlias = findAlcisAlias(bodySend, multipleParams);
			const tokenUsed = await ValidTokenRepository.GetValidToken(
				tokenAlias
			);
			await ValidTokenRepository.updateTokenStatus(
				tokenUsed.id,
				tokenUsed.tokenSystem
			);
		} catch (err) {
			throw err;
		}

		try {
			const tokenAlias = findAlcisAlias(bodySend, multipleParams);
			const tokenUsed = await ValidTokenRepository.GetValidToken(
				tokenAlias
			);
			await ValidTokenRepository.updateTokenStatus(
				tokenUsed.id,
				tokenUsed.tokenSystem
			);

			const alcisToken = tokenUsed.token;

			const response = await AxiosRequestComplete(
				urlSend,
				bodySend,
				nameToken,
				'Bearer ' + alcisToken,
				methodAxios,
				paramName,
				paramsValue,
				routineName,
				multipleHeaders,
				multipleParams
			);

			if (response instanceof Error) {
				throw response;
			}

			return response;
		} catch (error) {
			if (+error?.status !== 401) {
				loggerElastic(
					'flow-alcis-controller',
					String(error?.status),
					'flow-alcis-controller',
					'flow-alcis-controller',
					JSON.stringify(urlSend),
					JSON.stringify(
						error || {
							erro: 'Error response do controller veio vazia'
						}
					)
				);
			}

			throw error;
		}
	}
}
