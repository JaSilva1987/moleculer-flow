'use strict';
import { CronJob } from 'cron';
import {
	Errors,
	Service as MoleculerService,
	ServiceBroker,
	ServiceSchema
} from 'moleculer';
import { Event, Method, Service } from 'moleculer-decorators';
import * as dotenv from 'dotenv';
import { AxiosRequestType } from '../../../library/axios';
import {
	apmElasticConnect,
	loggerElastic
} from '../../../library/elasticSearch';
import {
	getTokenGlobal,
	getTokenUrlGlobal
} from '../../../library/erpProtheus';
import { IGetToken } from '../../../../src/interface/erpProtheus/global';
import { ITriangulationType } from '../../../../src/interface/erpProtheus/type/triangulationType.interface';
dotenv.config();

@Service({
	name: 'service.erpProtheus.viveo.pollGetTriangulationTypeData',
	group: 'flow-pfs'
})
export default class PoolGetTriangulationTypeDataService extends MoleculerService {
	public indexName = 'flow-erpprotheus-routeorders';
	public serviceName = 'poolGetTriangulationTypeData.service';
	public originLayer = 'erpprotheusviveo';

	public constructor(public broker: ServiceBroker, schema: ServiceSchema) {
		super(broker);
		this.cronJobOne = new CronJob(
			process.env.TRIANGULATION_TYPE_CRON,
			async () => {
				try {
					this.broker.broadcast(
						'service.erpProtheusviveo.type.poolGetTriangulationTypeDataERP',
						process.env.TRIANGULATION_TYPE_ATIVE
					);
				} catch {
					new Error('Cron not run');
				}
			}
		);

		if (!this.cronJobOne.running) this.cronJobOne.start();
	}

	@Event({
		name: 'service.erpProtheusviveo.type.poolGetTriangulationTypeDataERP',
		group: 'flow-pfs'
	})
	public async poolGetTriangulationTypeDataERP(enabled: string) {
		if (enabled === 'true') {
			try {
				const token: IGetToken = await getTokenUrlGlobal(
					process.env.PROTHEUSVIVEO_TRIANGULACAO_PFS_BASEURL +
						process.env.PROTHEUSVIVEO_URLTOKEN +
						process.env.PROTHEUSVIVEO_USER +
						process.env.PROTHEUSVIVEO_PASS_TRIANGULACAO_PFS
				);

				if (token.access_token) {
					const urlRequest =
						process.env.PROTHEUSVIVEO_TRIANGULACAO_PFS_BASEURL +
						'/ProductTriangulationControl/api/v2/typeOperation/';

					const response = await AxiosRequestType(
						urlRequest,
						'',
						'get',
						{
							['Authorization']: 'Bearer ' + token.access_token,
							['TenantId']: '01,001001'
						}
					);

					if (response.status == 200) {
						if (response.message.total > 0) {
							for (const iterator of response.message.data
								.typeTriangulation) {
								const sendTriangulationsTypes: ITriangulationType =
									iterator;
								await this.broker.broadcast(
									'pfs.integration.type.triangulationTypesPfs',
									sendTriangulationsTypes
								);
							}
						}
					}

					loggerElastic(
						this.indexName,
						response.status ? '200' : '400',
						this.originLayer,
						this.serviceName,
						`GET ${urlRequest}`,
						JSON.stringify(response.message)
					);
				}
			} catch (error) {
				loggerElastic(
					this.indexName,
					error.code,
					this.originLayer,
					this.serviceName,
					'',
					JSON.stringify(error.message)
				);
				apmElasticConnect
					.setTransactionName(this.indexName)
					.captureError(new Error(error.message))
					.endTransaction();
			}
		}
	}
}
