import { simpleRequest } from '../../../../services/library/axios';
import {
	apmElasticConnect,
	loggerElastic
} from '../../../../services/library/elasticSearch';
import { EnumAlcis } from '../../../enum/alcis/enum';
import { IIOrderConfirmation, IOrderConfirmationData } from '../../../interface/alcis/order/orderConfirmation/orderConfirmation.interface';
import { OrderConfirmationRepository } from '../../../repository/integration/order/orderConfirmation.repository';

const indexName = 'flow-alcis-controller-orderconfirmation';
const serviceName = 'controller-protheus';
const originLayer = 'alcis';
const indexNameProtheus = 'erp-protheus-alcis';
const editing = 'edição';

export async function setTransaction(setActive: boolean) {
	try {
		let protheusUrlMafraProcess =
			process.env.PROTHEUS_ALCIS_GKO_BASEURL_MAFRA +
			process.env.PROTHEUS_ALCIS_GKO_ALCIS_ORDER_CONFIRMATION;
		let protheusUrlCremerProcess =
			process.env.PROTHEUS_ALCIS_GKO_BASEURL_CREMER +
			process.env.PROTHEUS_ALCIS_GKO_ALCIS_ORDER_CONFIRMATION;

		if (setActive == true) {
			apmElasticConnect.startTransaction(
				'IA Version 1 => CronJob => Protheus - PUT Order Confirmation',
				'request'
			);

			await processOrderConfirmation(
				'M02',
				Boolean(process.env.ALCIS_PROTHEUS_CONFIRMATION_ACTIVE_M02),
				protheusUrlMafraProcess,
				'M02',
				'01,001002'
			);

			await processOrderConfirmation(
				'M03',
				Boolean(process.env.ALCIS_PROTHEUS_CONFIRMATION_ACTIVE_M03),
				protheusUrlMafraProcess,
				'M03',
				'01,001003'
			);

			await processOrderConfirmation(
				'M10',
				Boolean(process.env.ALCIS_PROTHEUS_CONFIRMATION_ACTIVE_M10),
				protheusUrlMafraProcess,
				'M10',
				'01,001010'
			);

			await processOrderConfirmation(
				'M13',
				Boolean(process.env.ALCIS_PROTHEUS_CONFIRMATION_ACTIVE_M13),
				protheusUrlMafraProcess,
				'M13',
				'01,001013'
			);

			await processOrderConfirmation(
				'M15',
				Boolean(process.env.ALCIS_PROTHEUS_CONFIRMATION_ACTIVE_M15),
				protheusUrlMafraProcess,
				'M15',
				'01,001015'
			);

			await processOrderConfirmation(
				'M21',
				Boolean(process.env.ALCIS_PROTHEUS_CONFIRMATION_ACTIVE_M21),
				protheusUrlMafraProcess,
				'M21',
				'01,001021'
			);

			await processOrderConfirmation(
				'M23',
				Boolean(process.env.ALCIS_PROTHEUS_CONFIRMATION_ACTIVE_M23),
				protheusUrlMafraProcess,
				'M23',
				'01,001023'
			);

			await processOrderConfirmation(
				'M24',
				Boolean(process.env.ALCIS_PROTHEUS_CONFIRMATION_ACTIVE_M24),
				protheusUrlMafraProcess,
				'M24',
				'01,001024'
			);

			await processOrderConfirmation(
				'021',
				Boolean(process.env.ALCIS_PROTHEUS_CONFIRMATION_ACTIVE_021),
				protheusUrlCremerProcess,
				'021',
				'11,001021'
			);

			await processOrderConfirmation(
				'036',
				Boolean(process.env.ALCIS_PROTHEUS_CONFIRMATION_ACTIVE_036),
				protheusUrlCremerProcess,
				'036',
				'11,001036'
			);

			await processOrderConfirmation(
				'043',
				Boolean(process.env.ALCIS_PROTHEUS_CONFIRMATION_ACTIVE_043),
				protheusUrlCremerProcess,
				'043',
				'11,001043'
			);
		}
	} catch (error) {
		loggerElastic(
			indexName,
			'499',
			originLayer,
			'IA Version 1 => CronJob => Protheus - PUT Order Confirmation',
			JSON.stringify(
				'Erro Processo de Busca no Banco de Dados e Envio ao Protheus'
			),
			JSON.stringify(error)
		);

		apmElasticConnect.endTransaction([serviceName]);
	}
}

async function processOrderConfirmation(
	site: string,
	processEnvVar: boolean,
	protheusUrl: string,
	processName: string,
	tenantID: string
) {
	if (processEnvVar) {
		const orders: Object[] =
			await OrderConfirmationRepository.GetOrders(
				site,
				EnumAlcis.awaitProcess
			);

		if (orders.length > 0) {
			await Promise.all(
				orders.map(async (order: IOrderConfirmationData) => {
					await OrderConfirmationRepository.PutOrders({
						site: order.site,
						numeroPedido: order.numeroPedido,
						status: EnumAlcis.awaitIntegration
					});

					await new Promise((resolve) => setTimeout(resolve, 1000));

					try {
						const requestProtheus: IIOrderConfirmation =
							await simpleRequest(
								protheusUrl,
								'put',
								{
									Authorization: '',
									TenantID: tenantID,
									Connection: 'keep-alive'
								},
								JSON.parse(order.json)
							);

						loggerElastic(
							indexNameProtheus,
							JSON.stringify(requestProtheus.status),
							originLayer,
							`IA Version 1 => Protheus - PUT Order Confirmation (${processName})`,
							`Requisição Enviada ao Protheus: ${order.json}`,
							`Response Recebido do Protheus: ${JSON.stringify(
								requestProtheus
							)}`
						);

						if (requestProtheus.status == 400) requestProtheus.status = 425;

						const inEdition =
							typeof requestProtheus.message === 'string'
								? requestProtheus.message.includes(editing)
								: Object.values(requestProtheus.message).some(
										(valor) =>
											valor
												.toString()
												.toLowerCase()
												.includes(editing)
								  );

						if (
							requestProtheus.status == 200 ||
							requestProtheus.status == 'Sucesso'
						) {
							await OrderConfirmationRepository.PutOrders({
								site: order.site,
								numeroPedido: order.numeroPedido,
								status: EnumAlcis.isIntegrate
							});
						} else if (
							inEdition ||
							(typeof requestProtheus.status == 'number' &&
								requestProtheus.status >= 500)
						) {
							await OrderConfirmationRepository.PutOrders({
								site: order.site,
								numeroPedido: order.numeroPedido,
								status: EnumAlcis.awaitProcess
							});
						} else {
							await OrderConfirmationRepository.PutOrders({
								site: order.site,
								numeroPedido: order.numeroPedido,
								status: EnumAlcis.notIntegrate
							});
						}

						apmElasticConnect.endTransaction([serviceName]);
					} catch (error) {
						loggerElastic(
							indexName,
							'499',
							originLayer,
							'IA Version 1 => CronJob => Protheus - PUT Order Confirmation',
							JSON.stringify('Erro Update Banco de Dados'),
							JSON.stringify(error)
						);

						apmElasticConnect.endTransaction([serviceName]);
					}
				})
			);
		}
	}
}
