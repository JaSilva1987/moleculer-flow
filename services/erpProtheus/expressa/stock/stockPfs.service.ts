import { CronJob } from 'cron';
import * as dotenv from 'dotenv';
import {
	Service as MoleculerService,
	ServiceBroker,
	ServiceSchema
} from 'moleculer';
import { Event, Service } from 'moleculer-decorators';
import { IGetToken } from '../../../../src/interface/erpProtheus/global';
import { IStockPfsProtheus } from '../../../../src/interface/erpProtheus/stock/stockPfs.interface';
import { AxiosRequestType } from '../../../library/axios';
import {
	loggerElastic,
	apmElasticConnect
} from '../../../library/elasticSearch';
import { getTokenUrlGlobal } from '../../../library/erpProtheus';

dotenv.config();

@Service({
	name: 'pfs.erpprotheusexpressa.stocks',
	group: 'flow-pfs'
})
export default class StockPfsService extends MoleculerService {
	public constructor(public broker: ServiceBroker, schema: ServiceSchema) {
		super(broker);

		this.cronJobOne = new CronJob('0 0 */4 * * *', async () => {
			try {
				this.broker.broadcast(
					'pfs.erpprotheusexpressa.get.stocks',
					process.env.STOCK_PFS_ATIVE
				);
			} catch {
				new Error('Cron not run');
			}
		});

		if (!this.cronJobOne.running) this.cronJobOne.start();
	}

	public indexName = 'flow-pfs-stock';
	public serviceName = 'GetStockPfs.service';
	public originLayer = 'erpprotheusexpressa';

	@Event({
		name: 'pfs.erpprotheusexpressa.get.stocks',
		group: 'flow-pfs'
	})
	public async getStockPfs(enabled: string) {
		if (enabled === 'true') {
			this.logger.info(
				'==============BUSCA DADOS DO STOCK NO ERPPROTHEUS EXPRESSA=============='
			);
			try {
				const token: IGetToken = await getTokenUrlGlobal(
					process.env.PROTHEUSVIVEO_BASEURLAPFS_EXPRESSA +
						process.env.PROTHEUSVIVEO_RESTFUNCIONAL +
						process.env.PROTHEUSVIVEO_URLTOKEN +
						process.env.PROTHEUSVIVEO_USER +
						process.env.PROTHEUSVIVEO_PASSEXPRESSA
				);

				if (token.access_token) {
					const urlStock =
						process.env.PROTHEUSVIVEO_BASEURLAPFS_EXPRESSA +
						process.env.PROTHEUSVIVEO_RESTFUNCIONAL +
						'/ReturnableBatchStock/api/v1/stock';

					const response = await AxiosRequestType(
						urlStock,
						'',
						'get',
						{
							['Authorization']: 'Bearer ' + token.access_token,
							['TenantId']: '01,0675'
						}
					);

					if (response.status == 200) {
						if (response.message.total > 1) {
							for (
								let index = 0;
								index < response.message.total;
								index++
							) {
								const responseData: IStockPfsProtheus = {
									...response.message.data.stock[index]
								};

								await this.broker.broadcast(
									'pfs.integration.save.stocks',
									responseData
								);
							}
						} else if (response.message.total == 1) {
							const responseData: IStockPfsProtheus = {
								...response.message.data.stock
							};

							await this.broker.broadcast(
								'pfs.integration.save.stocks',
								responseData
							);
						}
					}

					loggerElastic(
						this.indexName,
						'200',
						this.originLayer,
						this.serviceName,
						`GET ${urlStock}`,
						JSON.stringify(response)
					);
				} else {
					loggerElastic(
						this.indexName,
						'400',
						this.originLayer,
						this.serviceName,
						'Token não gerado'
					);
				}
			} catch (error) {
				loggerElastic(
					this.indexName,
					'499',
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
