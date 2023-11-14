'use strict';
import {
	Context,
	Errors,
	Service as MoleculerService,
	ServiceBroker
} from 'moleculer';
import {
	IRegisterSeniorOuro,
	TRegisterSeniorOuro
} from '../../../src/interface/ouro/registerSeniorOuro.inteface';
import { apmElasticConnect, loggerElastic } from '../../library/elasticSearch';

export default class RegisterServices extends MoleculerService {
	responseApi: any | Array<object>;
	returnResponse: object;
	indexName = 'flow-senior';
	isCode = '200';
	originLayer = 'senior';
	serviceName = 'RegisterServices';

	public constructor(public broker: ServiceBroker) {
		super(broker);
		this.parseServiceSchema({
			name: 'senior.register',
			group: 'flow-senior',
			actions: {
				create: {
					cache: false,
					rest: {
						method: 'POST',
						basePath: 'senior',
						path: '/ouro/register'
					},
					async handler(
						ouroSerniorCreate: Context<IRegisterSeniorOuro>
					) {
						const setResponse: TRegisterSeniorOuro =
							await this.RegisterPost(ouroSerniorCreate);
						if (setResponse.status > 400) {
							return await Promise.reject(
								new Errors.MoleculerError(
									JSON.parse(JSON.stringify(setResponse)),
									setResponse.status != undefined &&
									typeof 'number'
										? setResponse.status
										: 499
								)
							);
						} else {
							return await Promise.resolve(setResponse);
						}
					}
				}
			}
		});
	}

	public async RegisterPost(ctxOuro: Context<IRegisterSeniorOuro>) {
		try {
			this.responseApi = await this.broker.emit(
				'senior.ouro.post.register',
				ctxOuro.params
			);

			this.responseApi.forEach((returnResponse: object) => {
				this.returnResponse = returnResponse;
			});

			loggerElastic(
				this.indexName,
				this.isCode,
				this.originLayer,
				this.serviceName,
				JSON.stringify(ctxOuro.params),
				JSON.stringify(this.responseApi)
			);
			return this.returnResponse;
		} catch (error) {
			loggerElastic(
				this.indexName,
				error.code,
				this.originLayer,
				this.serviceName,
				JSON.stringify(ctxOuro.params),
				JSON.stringify(error.message)
			);
			apmElasticConnect.captureError(new Error(error.message));
			throw new Errors.MoleculerError(error.message, error.code);
		}
	}
}
