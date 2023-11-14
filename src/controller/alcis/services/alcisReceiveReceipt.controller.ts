import { simpleRequest } from '../../../../services/library/axios';
import {
	apmElasticConnect,
	loggerElastic
} from '../../../../services/library/elasticSearch';
import { EnumAlcis } from '../../../enum/alcis/enum';
import {
	IIReceiptReceivedConfirmation,
	IReceiptReceivedConfirmationData
} from '../../../interface/alcis/receipt/receiptConfirmation/receiptConfirmation.interface';
import { ReceiveReceiptRepository } from '../../../repository/integration/receipt/receiveReceipt.repository';

const indexName = 'flow-alcis-controller-receivereceipt';
const serviceName = 'controller-protheus';
const originLayer = 'alcis';
const indexNameProtheus = 'erp-protheus-alcis';
const editing = 'edição';

export async function setTransaction(setActive: boolean) {
	try {
		let protheusUrlMafraProcess =
			process.env.PROTHEUS_ALCIS_GKO_BASEURL_MAFRA +
			process.env.PROTHEUS_ALCIS_GKO_RECEIVE_RECEIPT;
		let protheusUrlCremerProcess =
			process.env.PROTHEUS_ALCIS_GKO_BASEURL_CREMER +
			process.env.PROTHEUS_ALCIS_GKO_RECEIVE_RECEIPT;

		if (setActive == true) {
			apmElasticConnect.startTransaction(
				'IA Version 1 => CronJob => Protheus - PUT Receipt Received',
				'request'
			);

			await processReceiveReceipt(
				'M02',
				Boolean(process.env.ALCIS_PROTHEUS_RECEIPT_RECEIVED_ACTIVE_M02),
				protheusUrlMafraProcess,
				'M02',
				'01,001002'
			);

			await processReceiveReceipt(
				'M03',
				Boolean(process.env.ALCIS_PROTHEUS_RECEIPT_RECEIVED_ACTIVE_M03),
				protheusUrlMafraProcess,
				'M03',
				'01,001003'
			);

			await processReceiveReceipt(
				'M10',
				Boolean(process.env.ALCIS_PROTHEUS_RECEIPT_RECEIVED_ACTIVE_M10),
				protheusUrlMafraProcess,
				'M10',
				'01,001010'
			);

			await processReceiveReceipt(
				'M13',
				Boolean(process.env.ALCIS_PROTHEUS_RECEIPT_RECEIVED_ACTIVE_M13),
				protheusUrlMafraProcess,
				'M13',
				'01,001013'
			);

			await processReceiveReceipt(
				'M15',
				Boolean(process.env.ALCIS_PROTHEUS_RECEIPT_RECEIVED_ACTIVE_M15),
				protheusUrlMafraProcess,
				'M15',
				'01,001015'
			);

			await processReceiveReceipt(
				'M21',
				Boolean(process.env.ALCIS_PROTHEUS_RECEIPT_RECEIVED_ACTIVE_M21),
				protheusUrlMafraProcess,
				'M21',
				'01,001021'
			);

			await processReceiveReceipt(
				'M23',
				Boolean(process.env.ALCIS_PROTHEUS_RECEIPT_RECEIVED_ACTIVE_M23),
				protheusUrlMafraProcess,
				'M23',
				'01,001023'
			);

			await processReceiveReceipt(
				'M24',
				Boolean(process.env.ALCIS_PROTHEUS_RECEIPT_RECEIVED_ACTIVE_M24),
				protheusUrlMafraProcess,
				'M24',
				'01,001024'
			);

			await processReceiveReceipt(
				'021',
				Boolean(process.env.ALCIS_PROTHEUS_RECEIPT_RECEIVED_ACTIVE_021),
				protheusUrlCremerProcess,
				'021',
				'11,001021'
			);

			await processReceiveReceipt(
				'036',
				Boolean(process.env.ALCIS_PROTHEUS_RECEIPT_RECEIVED_ACTIVE_036),
				protheusUrlCremerProcess,
				'036',
				'11,001036'
			);

			await processReceiveReceipt(
				'043',
				Boolean(process.env.ALCIS_PROTHEUS_RECEIPT_RECEIVED_ACTIVE_043),
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
			'IA Version 1 => CronJob => Protheus - PUT Receipt Received',
			JSON.stringify(
				'Erro Processo de Busca no Banco de Dados e Envio ao Protheus'
			),
			JSON.stringify(error)
		);

		apmElasticConnect.endTransaction([serviceName]);
	}
}

async function processReceiveReceipt(
	site: string,
	processEnvVar: boolean,
	protheusUrl: string,
	processName: string,
	tenantID: string
) {
	if (processEnvVar) {
		const orders: Object[] = await ReceiveReceiptRepository.GetOrders(
			site,
			EnumAlcis.awaitProcess
		);

		if (orders.length > 0) {
			await Promise.all(
				orders.map(async (receipt: IReceiptReceivedConfirmationData) => {
					await ReceiveReceiptRepository.PutOrders({
						site: receipt.site,
						numeroDoRecebimento: receipt.numeroDoRecebimento,
						status: EnumAlcis.awaitIntegration
					});

					await new Promise((resolve) => setTimeout(resolve, 1000));

					try {
						const requestProtheus: IIReceiptReceivedConfirmation =
							await simpleRequest(
								protheusUrl,
								'put',
								{
									Authorization: '',
									TenantID: tenantID,
									Connection: 'keep-alive'
								},
								JSON.parse(receipt.json)
							);

						loggerElastic(
							indexNameProtheus,
							JSON.stringify(requestProtheus.status),
							originLayer,
							`IA Version 1 => Protheus - PUT Receipt Received (${processName})`,
							`Requisição Enviada ao Protheus: ${receipt.json}`,
							`Response Recebido do Protheus: ${JSON.stringify(
								requestProtheus
							)}`
						);

						if (requestProtheus.status == 400) requestProtheus.status = 425;

						const inEdition =
							typeof requestProtheus.message === 'string'
								? requestProtheus.message
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
							await ReceiveReceiptRepository.PutOrders({
								site: receipt.site,
								numeroDoRecebimento: receipt.numeroDoRecebimento,
								status: EnumAlcis.isIntegrate
							});
						} else if (
							inEdition ||
							(typeof requestProtheus.status == 'number' &&
								requestProtheus.status >= 500)
						) {
							await ReceiveReceiptRepository.PutOrders({
								site: receipt.site,
								numeroDoRecebimento: receipt.numeroDoRecebimento,
								status: EnumAlcis.awaitProcess
							});
						} else {
							await ReceiveReceiptRepository.PutOrders({
								site: receipt.site,
								numeroDoRecebimento: receipt.numeroDoRecebimento,
								status: EnumAlcis.notIntegrate
							});
						}

						apmElasticConnect.endTransaction([serviceName]);
					} catch (error) {
						loggerElastic(
							indexName,
							'499',
							originLayer,
							'IA Version 1 => CronJob => Protheus - PUT Receipt Received',
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
