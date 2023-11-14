import * as dotenv from 'dotenv';
import { loggerElastic } from '../../../../services/library/elasticSearch';

dotenv.config();

export default class ConsumerErpProtheusViveoController {
	public async ValidaSuframa(
		ConsSuframa: string,
		Suframa: string,
		SituacaoSuframaHoje: string
	) {
		let get_DB_DIRETO = false;
		let response = 0;
		let txt = '';
		try {
			if (
				ConsSuframa == 'S' &&
				Suframa != '' &&
				SituacaoSuframaHoje != 'VALIDO' &&
				SituacaoSuframaHoje != ''
			) {
				get_DB_DIRETO = true; //falta consultar DBDireto

				if (get_DB_DIRETO != true) {
					response = 0;
				} else {
					response = 1;
				}
			}

			if (response == 0) {
				txt = 'OK';
			} else {
				txt = 'FALHA';
			}

			return response;
		} catch (error) {
			loggerElastic(
				'flow-integration-routeorders',
				'499',
				'',
				'consValidateConsumer.service',
				'integration',
				JSON.stringify(error.message)
			);
		}
	}

	public async ValidacaoEspecial(StatusRegEspecial: string) {
		let response = 0;
		let txt;

		if (StatusRegEspecial == 'VENCIDO') {
			response = 1;
		}

		if (response == 0) {
			txt = 'OK';
		} else {
			txt = 'FALHA';
		}

		return response;
	}
}
