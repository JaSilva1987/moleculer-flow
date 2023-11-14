import axios from 'axios';
import * as dotenv from 'dotenv';
import { IGetLoginGkoJSON } from '../../../src/interface/gko/global/getLoginGko.interface';
import { IGetTokenError } from '../../../src/interface/gko/global/getTokenGko.interface';
import { xmlToJSON } from '../shared/xlm-json';
import https from 'https';

dotenv.config();
async function getToken() {
	let tokenXmlRequestBody = `
	<GKO>
	<Servico tpServico="app">
	<login TpLogin="login_sem_menu">
	<Database>${process.env.GKO_DATABASE}</Database>
	<Usuario>${process.env.GKO_USER}</Usuario>
	<Senha>${process.env.GKO_PASSWORD}</Senha>
	<AplicacaoCliente>App Teste</AplicacaoCliente>
	</login>
    </Servico>
    </GKO>`;
	const instance = axios.create({
		httpsAgent: new https.Agent({
			rejectUnauthorized: false
		})
	});
	const agent = new https.Agent({
		rejectUnauthorized: false
	});
	const requestConfig = {
		headers: { 'Content-Type': 'text/xml' },
		timeout: 100000,
		httpsAgent: agent
	};
	try {
		const tokenRequestResult = await instance.post(
			process.env.GKO_TOKEN_API!,
			tokenXmlRequestBody,
			requestConfig
		);
		if (+tokenRequestResult?.status === 401) {
			throw tokenRequestResult;
		}
		let resConverted: IGetLoginGkoJSON = xmlToJSON(tokenRequestResult.data);
		let idsessao = resConverted.GKO.Servico._attributes.idsessao;
		return +idsessao;
	} catch (error) {
		let errorGetTokenGko: IGetTokenError = {
			message:
				'Erro request timeout ao recolher o Token GKO, verificar no sistema motivo do erro',
			code: 404,
			errorBody: {
				data: error.data,
				requestLink: process.env.GKO_TOKEN_API!
			}
		};
		return errorGetTokenGko;
	}
}
export { getToken };
