import { AxiosRequestComplete } from '../../../../services/library/axios';
import { loggerElastic } from '../../../../services/library/elasticSearch';
import { setTimeout } from 'timers/promises';

interface AlcisRequestOptions {
	urlSend: string;
	bodySend: any;
	nameToken: string;
	methodAxios: 'get' | 'post' | 'put';
	paramName?: string;
	paramsValue?: string;
	routineName?: string;
	multipleHeaders?: object | null;
	multipleParams?: object | null;
}

function tenantIdHeaders(site: string): Record<string, string> {
	const tenantOptions = [
		{ site: 'M02', empresa: '01', filial: '001002' },
		{ site: 'M03', empresa: '01', filial: '001003' },
		{ site: 'M10', empresa: '01', filial: '001010' },
		{ site: 'M13', empresa: '01', filial: '001013' },
		{ site: 'M15', empresa: '01', filial: '001015' },
		{ site: 'M21', empresa: '01', filial: '001021' },
		{ site: 'M23', empresa: '01', filial: '001023' },
		{ site: 'M24', empresa: '01', filial: '001024' },
		{ site: '021', empresa: '11', filial: '001021' },
		{ site: '036', empresa: '11', filial: '001036' },
		{ site: '043', empresa: '11', filial: '001043' }
	];

	const tenant = tenantOptions.find((tenant) => tenant.site === site);

	return {
		TenantID: tenant ? `${tenant.empresa},${tenant.filial}` : ''
	};
}

export async function alcisRequestProtheusController({
	urlSend,
	bodySend,
	nameToken,
	methodAxios,
	paramName,
	paramsValue,
	routineName,
	multipleHeaders = null,
	multipleParams = null
}: AlcisRequestOptions) {
	try {
		await setTimeout(1000);

		const tenantId = tenantIdHeaders(bodySend.site);
		multipleHeaders = multipleHeaders
			? { ...multipleHeaders, ...tenantId }
			: tenantId;

		await setTimeout(1000);

		const response = await AxiosRequestComplete(
			urlSend,
			bodySend,
			nameToken,
			`Bearer ${process.env.AUTHENTICATION_TOKEN}`,
			methodAxios,
			paramName,
			paramsValue,
			routineName,
			multipleHeaders,
			multipleParams
		);

		const responseStatus = +response.status;

		loggerElastic(
			'alcis-protheus-controller',
			String(responseStatus),
			'alcis-protheus-controller',
			'alcis-protheus-controller',
			JSON.stringify(urlSend),
			JSON.stringify(response || { erro: 'Response veio vazia' })
		);

		if (responseStatus >= 401) {
			throw new Error(`Unauthorized request: ${responseStatus}`);
		}

		return response;
	} catch (err) {
		const errorStatus = String(err?.status || undefined);

		loggerElastic(
			'alcis-protheus-controller',
			errorStatus,
			'alcis-protheus-controller',
			'alcis-protheus-controller',
			JSON.stringify(urlSend),
			JSON.stringify(
				err || { erro: 'Error response do controller veio vazia' }
			)
		);

		throw err;
	}
}
