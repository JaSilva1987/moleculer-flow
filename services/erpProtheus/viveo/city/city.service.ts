'use strict';

import * as dotenv from 'dotenv';
import {
	Errors,
	Service as MoleculerService,
	ServiceBroker,
	ServiceSchema
} from 'moleculer';
import { Event, Service } from 'moleculer-decorators';
import { ICityProtheus } from '../../../../src/interface/erpProtheus/city/city.interface';
import { IGetToken } from '../../../../src/interface/erpProtheus/global';
import { AxiosRequestType } from '../../../library/axios';
import {
	apmElasticConnect,
	loggerElastic
} from '../../../library/elasticSearch';
import { getTokenUrlGlobal } from '../../../library/erpProtheus';

dotenv.config();
@Service({
	name: 'ecommerce.erpprotheusviveo.city',
	group: 'flow-city'
})
export default class CityProtheus extends MoleculerService {
	public constructor(public broker: ServiceBroker, schema: ServiceSchema) {
		super(broker);
	}

	public indexName = 'flow-ecommerce-city';
	public serviceName = 'erpProtheusViveo.city.service';
	public originLayer = 'erpprotheusviveo';

	@Event({
		name: 'service.erpProtheusViveo.city.getcity',
		group: 'flow-erpprotheus'
	})
	public async GetCity(message: ICityProtheus) {
		try {
			this.logger.info(
				'==============BUSCA DADOS DO city / IBGE=============='
			);

			const getCitySpecial = await this.GetCityInJson(message);

			if (getCitySpecial) {
				return getCitySpecial;
			}

			const token: IGetToken = await getTokenUrlGlobal(
				process.env.PROTHEUSVIVEO_BASEURL +
					'11' +
					process.env.PROTHEUSVIVEO_URLTOKEN +
					process.env.PROTHEUSVIVEO_USER +
					process.env.PROTHEUSVIVEO_PASS
			);

			if (token.access_token) {
				const urlProtheusCity =
					process.env.PROTHEUSVIVEO_BASEURL +
					process.env.PROTHEUSVIVEO_RESTCREMER +
					'/FlowIntegration/api/v2/municipality';

				const requestProtheus = await AxiosRequestType(
					urlProtheusCity,
					'',
					'get',
					{ ['Authorization']: 'Bearer ' + token.access_token },
					{
						Filter: `city eq '${message.country}' and country eq '${message.city}'`
					}
				);

				if (requestProtheus.message.code == 400) {
					const getViaCep = await this.getcityviacep(message);

					if (getViaCep.status == 200) {
						return getViaCep.message;
					}
					return requestProtheus.message;
				} else {
					return requestProtheus.message.data.municipality;
				}
			}
		} catch (error) {
			loggerElastic(
				this.indexName,
				'499',
				this.originLayer,
				this.serviceName,
				JSON.stringify(error.message)
			);

			apmElasticConnect
				.setTransactionName(this.indexName)
				.captureError(new Error(error.message))
				.endTransaction();
		}

		return {
			status: 400,
			message: `Cidade não encontrada`
		};
	}

	public async getcityviacep(message: ICityProtheus) {
		const response = await AxiosRequestType(
			`https://viacep.com.br/ws/${message.cep}/json/`,
			'',
			'get'
		);

		if (response.status == 200) {
			return {
				status: response.status,
				message: {
					city: response.message.uf,
					codeCounty: response.message.ibge.substring(2),
					country: response.message.localidade
				}
			};
		}
	}

	//Cidades não retornadas pelo JSON por possuir apostrofo no nome
	public async GetCityInJson(message: ICityProtheus) {
		try {
			const cityJson = [
				{
					country: 'RO',
					codeCounty: '00130',
					city: "MACHADINHO D'OESTE"
				},
				{
					country: 'RO',
					codeCounty: '00148',
					city: "NOVA BRASILANDIA D'OESTE"
				},
				{
					country: 'RO',
					codeCounty: '00346',
					city: "ALVORADA D'OESTE"
				},
				{
					country: 'RO',
					codeCounty: '00015',
					city: "ALTA FLORESTA D'OESTE"
				},
				{
					country: 'RO',
					codeCounty: '00098',
					city: "ESPIGAO D'OESTE"
				},
				{
					country: 'RO',
					codeCounty: '00296',
					city: "SANTA LUZIA D'OESTE"
				},
				{
					country: 'RO',
					codeCounty: '01484',
					city: "SAO FELIPE D'OESTE"
				},
				{
					country: 'MA',
					codeCounty: '07407',
					city: "OLHO D'AGUA DAS CUNHAS"
				},
				{
					country: 'PA',
					codeCounty: '05551',
					city: "PAU D'ARCO"
				},
				{
					country: 'TO',
					codeCounty: '16307',
					city: "PAU D'ARCO"
				},
				{
					country: 'PI',
					codeCounty: '07108',
					city: "OLHO D'AGUA DO PIAUI"
				},
				{
					country: 'PI',
					codeCounty: '01176',
					city: "BARRA D'ALCANTARA"
				},
				{
					country: 'RN',
					codeCounty: '08409',
					city: "OLHO-D'AGUA DO BORGES"
				},
				{
					country: 'RN',
					codeCounty: '06205',
					city: "LAGOA D'ANTA"
				},
				{
					country: 'PB',
					codeCounty: '08703',
					city: "MAE D'AGUA"
				},
				{
					country: 'PB',
					codeCounty: '10402',
					city: "OLHO D'AGUA"
				},
				{
					country: 'AL',
					codeCounty: '05804',
					city: "OLHO D'AGUA DO CASADO"
				},
				{
					country: 'AL',
					codeCounty: '05705',
					city: "OLHO D'AGUA DAS FLORES"
				},
				{
					country: 'AL',
					codeCounty: '09004',
					city: "TANQUE D'ARCA"
				},
				{
					country: 'AL',
					codeCounty: '05903',
					city: "OLHO D'AGUA GRANDE"
				},
				{
					country: 'SE',
					codeCounty: '03203',
					city: "ITAPORANGA D'AJUDA"
				},
				{
					country: 'MG',
					codeCounty: '45455',
					city: "OLHOS-D'AGUA"
				},
				{
					country: 'BA',
					codeCounty: '10057',
					city: "DIAS D'AVILA"
				},
				{
					country: 'MG',
					codeCounty: '50539',
					city: "PINGO D'AGUA"
				},
				{
					country: 'SP',
					codeCounty: '02606',
					city: "APARECIDA D'OESTE"
				},
				{
					country: 'SP',
					codeCounty: '35200',
					city: "PALMEIRA D'OESTE"
				},
				{
					country: 'SP',
					codeCounty: '46108',
					city: "SANTA CLARA D'OESTE"
				},
				{
					country: 'SP',
					codeCounty: '47403',
					city: "SANTA RITA D'OESTE"
				},
				{
					country: 'SP',
					codeCounty: '15202',
					city: "ESTRELA D'OESTE"
				},
				{
					country: 'SP',
					codeCounty: '18008',
					city: "GUARANI D'OESTE"
				},
				{
					country: 'PR',
					codeCounty: '21356',
					city: "RANCHO ALEGRE D'OESTE"
				},
				{
					country: 'SP',
					codeCounty: '45803',
					city: "SANTA BARBARA D'OESTE"
				},
				{
					country: 'SP',
					codeCounty: '49300',
					city: "SAO JOAO DO PAU D'ALHO"
				},
				{
					country: 'PR',
					codeCounty: '07157',
					city: "DIAMANTE D'OESTE"
				},
				{
					country: 'PR',
					codeCounty: '19004',
					city: "PEROLA D'OESTE"
				},
				{
					country: 'SC',
					codeCounty: '06702',
					city: "HERVAL D'OESTE"
				},
				{
					country: 'PR',
					codeCounty: '25209',
					city: "SAO JORGE D'OESTE"
				},
				{
					country: 'PR',
					codeCounty: '11209',
					city: "ITAPEJARA D'OESTE"
				},
				{
					country: 'MT',
					codeCounty: '03809',
					city: "FIGUEIROPOLIS D'OESTE"
				},
				{
					country: 'MT',
					codeCounty: '03957',
					city: "GLORIA D'OESTE"
				},
				{
					country: 'MT',
					codeCounty: '05234',
					city: "LAMBARI D'OESTE"
				},
				{
					country: 'MT',
					codeCounty: '05622',
					city: "MIRASSOL D'OESTE"
				},
				{
					country: 'GO',
					codeCounty: '20009',
					city: "SAO JOAO D'ALIANCA"
				},
				{
					country: 'GO',
					codeCounty: '20702',
					city: "SITIO D'ABADIA"
				}
			];

			const found = cityJson.find(function (city) {
				return city.city === message.city;
			});

			return found;
		} catch (error) {
			console.log(error);
		}
	}
}
