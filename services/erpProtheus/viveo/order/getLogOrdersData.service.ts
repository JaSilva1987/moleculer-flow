'use strict';

import * as dotenv from 'dotenv';
import { Service as MoleculerService } from 'moleculer';
import { Event, Service } from 'moleculer-decorators';
import moment from 'moment';
import { IGetToken } from '../../../../src/interface/erpProtheus/global';
import {
	IArrayOrdersBranchIds,
	IOrdersBranchIds
} from '../../../../src/interface/integration/companies/ordersBranchIdData.interface';
import { IUpdatesErpCheckedStatusChange } from '../../../../src/interface/integration/order/updatesErpCheckedStatusChange.interface';
import { AxiosRequestType } from '../../../library/axios';
import { loggerElastic } from '../../../library/elasticSearch';
import { getToken } from '../../../library/erpProtheus';
dotenv.config();
@Service({
	name: 'service.erpProtheus.order.getLogOrdersData',
	group: 'flow-cremmer'
})
export default class getLogOrdersDataService extends MoleculerService {
	public indexName = 'flow-integration-routeorders';
	public serviceName = 'getLogOrdersData.service';
	public originLayer = 'erpprotheusviveo';
	status_flow: string;

	@Event({
		name: 'service.erpProtheus.order.getLogOrdersDataERP',
		group: 'flow-cremmer'
	})
	public async GetLogOrdersERP(message: IArrayOrdersBranchIds) {
		const verifyDate = new Date('1984-01-01');
		try {
			this.logger.info('======= INICIO CONSULTA PROTHEUS =======');

			if (message.orders) {
				const token: IGetToken = await getToken(
					process.env.PROTHEUSVIVEO_RESTCREMER
				);

				if (token.access_token) {
					const paramsHideLot = 'true';
					const dataLine: IOrdersBranchIds = message.orders;
					const dataOrder = new Date(
						moment(dataLine.data).format('YYYY-MM-DD')
					);
					if (dataOrder < verifyDate) {
						dataLine.data = verifyDate;
					}
					let paramsUpdateDate = moment(dataLine.data).format(
						'YYYYMMDD'
					);
					let paramsUpdateHour = dataLine.hora;

					const urlProtheusOrder =
						process.env.PROTHEUSVIVEO_BASEURL +
						process.env.PROTHEUSVIVEO_RESTCREMER +
						process.env.PROTHEUSVIVEO_URLORDERV2;

					const response = await AxiosRequestType(
						urlProtheusOrder,
						'',
						'get',
						{
							tenantID: `${dataLine.tenantId},${dataLine.branchId}`,
							Authorization: 'Bearer ' + token.access_token
						},
						{
							dDtAlteracao: paramsUpdateDate,
							paramsUpdateHour: paramsUpdateHour,
							cOrigem: 'ISOCRM',
							lOcultaLote: paramsHideLot
						}
					);

					response.status =
						typeof response.status === 'string'
							? 400
							: response.status;

					if (response.status == 200) {
						const returnData: any = response.message;

						for (let f = 0; f < returnData.length; f++) {
							switch (returnData[f].cStatus) {
								case '3': //PROCESSADO COM SUCESSO (FATURADO TOTAL)
									this.status_flow = '5'; //FATURADO TOTAL
									break;
								case '4': //CANCELADO
									this.status_flow = '3'; //CANCELADO TOTAL
									break;
								case '5': //BLOQUEADO (NÃO FATURADO, APENAS ALTERADO - OF GERADA)
									this.status_flow = '1'; //ABERTO E INTEGRADO NO PROTHEUS
									break;
								case '6': //PARCIALMENTE FATURADO
									this.status_flow = '4'; //PARCIAL
									break;
							}

							if (
								this.status_flow == '3' &&
								returnData[f].cTipoCancelamento == 'R'
							) {
								this.status_flow = '6';
							}

							if (
								this.status_flow != '0' &&
								returnData[f].cGrauParentesco != '3'
							) {
								let dataOrderModified = JSON.stringify({
									tenantId: 11,
									orderId: returnData[f].cNumCRM,
									sourceCRM: returnData[f].cOrigem,
									status: this.status_flow
								});

								await this.broker.broadcast(
									'service.crmIso.order.ordersModified',
									dataOrderModified
								);
							}
						}

						loggerElastic(
							this.indexName,
							'200',
							this.originLayer,
							this.serviceName,
							`get - ${urlProtheusOrder} `,
							JSON.stringify(response)
						);
					} else {
						loggerElastic(
							this.indexName,
							'400',
							this.originLayer,
							this.serviceName,
							`get - ${urlProtheusOrder} `,
							JSON.stringify(response)
						);
					}

					const dataupdatesErpChecked: IUpdatesErpCheckedStatusChange =
						{
							runDate: new Date(),
							runTime: moment(new Date()).format('HH:mm'),
							range: new Date(),
							tenantId: dataLine.tenantId,
							branchId: dataLine.branchId,
							sourceCRM: dataLine.sourceCRM,
							commandSent: urlProtheusOrder,
							success: response.status == 200 ? '1' : '0',
							responseCode: response.status,
							response: JSON.stringify(response)
						};

					await this.broker.broadcast(
						'service.integration.order.updatesErpChecked',
						dataupdatesErpChecked
					);
				}
			}
		} catch (error) {
			loggerElastic(
				this.indexName,
				'499',
				this.originLayer,
				this.serviceName,
				JSON.stringify(message),
				JSON.stringify(error.message)
			);
			this.logger.error(error.message, 499);
		}
	}
}
