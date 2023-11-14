('use strict');

import { Service as MoleculerService, ServiceBroker } from 'moleculer';
import { Event, Service } from 'moleculer-decorators';
import qs from 'qs';
import {
	IITokenOuro,
	ITokenOuro
} from '../../../src/interface/ouro/getTokenOuro.serviceinterface';
import { IRegisterSeniorOuro } from '../../../src/interface/ouro/registerSeniorOuro.inteface';
import { AxiosRequest } from '../../library/axios';
import { loggerElastic } from '../../library/elasticSearch';

@Service({
	name: 'senior.ouro.register',
	group: 'flow-senior'
})
export default class RegisterServices extends MoleculerService {
	responseApi: any | Array<object>;
	returnResponse: object;
	indexName = 'flow-senior';
	isCode = '200';
	originLayer = 'ouro';
	serviceName = 'RegisterServices';

	public constructor(public broker: ServiceBroker) {
		super(broker);
	}

	@Event({
		name: 'senior.ouro.post.register',
		group: 'flow-senior'
	})
	public async PostRegisterSeniorOuro(ctxOuro: IRegisterSeniorOuro) {
		try {
			const objToken = {
				method: 'POST',
				url: process.env.SENIOR_OURO_URLBASE + 'v1/token',
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded'
				},
				data: qs.stringify({
					username: process.env.OURO_USERNAME,
					password: process.env.OURO_PASSWORD,
					grant_type: process.env.OURO_GRANTTYPE,
					client_secret: process.env.OURO_CLIENT_SECRET,
					client_id: process.env.OURO_CLIENT_ID
				})
			};

			const generateToken: object = await AxiosRequest(objToken);
			const objTokenOuro: IITokenOuro = generateToken;
			const genToken: ITokenOuro = objTokenOuro.message;
			if (genToken.access_token) {
				const objSend = {
					method: 'PUT',
					url:
						process.env.SENIOR_OURO_URLBASE +
						'Api/OuroWeb/clientes',
					headers: {
						[process.env.CONTENT_TYPE_NAME]:
							process.env.CONTENT_TYPE,
						Authorization: 'Bearer ' + genToken.access_token
					},
					data: JSON.stringify([ctxOuro])
				};

				this.requestOuro = await AxiosRequest(objSend);
			} else {
				this.requestOuro = {
					meta: {
						statusHttp: 401,
						message: generateToken
					}
				};
			}

			return this.requestOuro;
		} catch (error) {
			loggerElastic(
				this.indexName,
				'499',
				this.originLayer,
				this.serviceName,
				JSON.stringify(ctxOuro),
				JSON.stringify(error.message)
			);
		}
	}
}
