import axios from 'axios';
import { IGetTokenError } from '../../../src/interface/gko/global/getTokenGko.interface';

async function logoutToken(token: string) {
	let tokenXmlRequestBody = `<GKO>
    <Servico idsessao="${token}" tpServico="app">
        <login TpLogin="logout" />
    </Servico>
</GKO>`;

	const requestConfig = {
		headers: { 'Content-Type': 'text/xml' },
		timeout: 7000
	};
	try {
		await axios.post(
			process.env.GKO_TOKEN_API!,
			tokenXmlRequestBody,
			requestConfig
		);

		return;
	} catch (error) {
		let errorGetTokenGko: IGetTokenError = {
			message:
				'Erro request timeout ao desativar o Token GKO, verificar no sistema motivo do erro',
			code: 404,
			errorBody: {
				data: error.data,
				requestLink: process.env.GKO_TOKEN_API!
			}
		};
		return errorGetTokenGko;
	}
}

export { logoutToken };
