import axios from 'axios';
import { logoutToken } from '../../../../services/library/gko/logoutToken';
import { jsonToXml, xmlToJSON } from '../../../../services/library/shared';
import { IGetTokenExpiredGkoJSON } from '../../../interface/gko/global/tokenExpiredGko.interface';
import { ValidTokenRepository } from '../../../repository/integration/token/token.repository';
import https from 'https';

async function httpPostGko(xmlBody: any) {
	const agent = new https.Agent({ rejectUnauthorized: false });

	let config = {
		headers: { 'Content-Type': 'text/xml;charset=utf-8' },
		httpsAgent: agent
	};

	try {
		let tokenRequest = await ValidTokenRepository.GetValidToken('gko');
		console.log(tokenRequest);
		let gkoToken = tokenRequest.token;

		xmlBody = xmlToJSON(xmlBody);
		xmlBody.GKO.Servico._attributes.idsessao = gkoToken;
		xmlBody = jsonToXml(xmlBody);

		const response = await axios.post(
			process.env.POST_GKO_SERVICES!,
			xmlBody,
			config
		);

		if (response.status === 406) {
			throw response;
		}

		console.log(
			'=====================LOG RESPONSE GKO=========================',
			response
		);

		return response.data;
	} catch (err) {
		console.log(
			'=====================LOG RETRY TOKEN GKO========================='
		);

		if (err?.response?.status !== 406) {
			return err.response.data;
		}

		let errorData = new IGetTokenExpiredGkoJSON();

		errorData.GKO = xmlToJSON(err.response.data).GKO;

		if (errorData && errorData instanceof IGetTokenExpiredGkoJSON) {
			let tokenExpiredCode = process.env.GKO_EXPIRED_TOKEN_CODE;
			let errorGkoCode =
				errorData.GKO.Servico.Mensagens.Mensagem.cdMensagem._text;
			console.log(errorGkoCode);
			if (errorGkoCode === tokenExpiredCode) {
				let tokenUsed = await ValidTokenRepository.GetValidToken('gko');
				await logoutToken(tokenUsed.token);
				await ValidTokenRepository.updateTokenStatus(
					tokenUsed.id,
					'gko'
				);
			}
		} else {
			return err.response.data;
		}
		try {
			let tokenRequest = await ValidTokenRepository.GetValidToken('gko');
			let gkoToken = tokenRequest.token;

			console.log('GKO TOKEN', tokenRequest);

			xmlBody = xmlToJSON(xmlBody);
			xmlBody.GKO.Servico._attributes.idsessao = gkoToken;
			xmlBody = jsonToXml(xmlBody);

			const response = await axios.post(
				process.env.POST_GKO_SERVICES!,
				xmlBody,
				config
			);

			return response.data;
		} catch (error) {
			return error.response.data;
		}
	}
}

export { httpPostGko };
