import * as dotenv from 'dotenv';
import moment from 'moment';
import { AxiosRequestSimple } from '../axios/axiosRequest';
import { loggerElastic } from '../elasticSearch';
import ValidaTokenController from '../../../src/controller/integration/token/tokenProtheus.controller';

dotenv.config();

const indexName = 'flow-library-erpprotheus-gettoken';
const serviceName = 'getToken';
const originLayer = 'library';
let startDate = moment(new Date());
let token: any;

export async function getToken(companyActive: string) {
	try {
		let urlToken =
			process.env.PROTHEUSVIVEO_BASEURL +
			companyActive +
			process.env.PROTHEUSVIVEO_URLTOKEN +
			process.env.PROTHEUSVIVEO_USER +
			process.env.PROTHEUSVIVEO_PASS;

		const response = await AxiosRequestSimple(urlToken, 'post');

		loggerElastic(
			indexName,
			response.status.toString(),
			originLayer,
			serviceName,
			`post - ${urlToken}`,
			JSON.stringify(response.message)
		);

		return response.message;
	} catch (error) {
		loggerElastic(
			indexName,
			'499',
			originLayer,
			serviceName,
			`post - ${this.urlToken}`,
			JSON.stringify(error)
		);
		return error;
	}
}

export async function getTokenGlobal(
	baseUrl: string,
	companyActive: string,
	tokenAdress: string,
	userName: string,
	passWord: string
) {
	try {
		let urlToken =
			baseUrl + companyActive + tokenAdress + userName + passWord;

		const response = await AxiosRequestSimple(urlToken, 'post');

		return response.message;
	} catch (error) {
		return error;
	}
}

export async function getTokenUrlGlobal(urlToken: string) {
	try {
		const controller = new ValidaTokenController();

		const response = await controller.validToken(urlToken);

		return response;
	} catch (error) {
		return error;
	}
}
