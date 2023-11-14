import * as dotenv from 'dotenv';
import { Service as MoleculerService } from 'moleculer';
import { Event, Service } from 'moleculer-decorators';
import { IInvoiceErpProtheus } from '../../../src/interface/erpProtheus/invoice/invoice.interface';
import { apmElasticConnect, loggerElastic } from '../../library/elasticSearch';
import { xmlToJSON } from '../../library/shared';
import {
	IInvoiceOrder,
	IInvoiceRecipient,
	IInvoiceRecipientAdress,
	IInvoiceTaxDocE,
	IInvoiceTotalExpress
} from '../../../src/interface/totalExpress/invoice.interface';
import { InvoiceTotalExpressRepository } from '../../../src/repository/integration/invoice/invoiceTotalExpress.repository';
import { statusEcommerceIntegration } from '../../../src/enum/integration/statusEcommerceProducts.enum';
import {
	IDataInvoiceTotalExpress,
	ISendInvoiceTotalExpress
} from '../../../src/interface/integration/invoice/invoiceTotalExpress.interface';

dotenv.config();

@Service({
	name: 'service.integrationtotalexpress.invoice',
	group: 'flow-totalexpress'
})
export default class InvoiceOrderEcommerceService extends MoleculerService {
	public indexName = 'flow-totalexpress-invoice';
	public serviceName = 'integration.invoice.service';
	public originLayer = 'integration';

	@Event({
		name: 'totalexpress.integration.invoice',
		group: 'flow-totalexpress'
	})
	public async invoiceOrderEcommerce(message: IInvoiceErpProtheus) {
		try {
			const repository = InvoiceTotalExpressRepository;

			const buffer = Buffer.from(message.XML, 'base64');
			const xmlString = buffer.toString('utf8');
			const jsonXML = xmlToJSON(xmlString).nfeProc.NFe.infNFe;

			const taxDocE: IInvoiceTaxDocE = {
				nfeNumero: parseInt(message.invoice),
				nfeSerie: message.series,
				nfeData: message.dateAuthorization,
				nfeValTotal: jsonXML.total.ICMSTot.vNF._text,
				nfeValProd: jsonXML.total.ICMSTot.vProd._text,
				nfeChave: message.key
			};

			const recipientAdress: IInvoiceRecipientAdress = {
				logradouro: jsonXML.dest.enderDest.xLgr._text,
				numero: jsonXML.dest.enderDest.nro._text,
				complemento: '',
				pontoReferencia: '',
				bairro: jsonXML.dest.enderDest.xBairro._text,
				cidade: jsonXML.dest.enderDest.xMun._text,
				estado: jsonXML.dest.enderDest.UF._text,
				cep: jsonXML.dest.enderDest.CEP._text
			};

			const recipient: IInvoiceRecipient = {
				nome: jsonXML.dest.xNome._text,
				cpfCnpj: jsonXML.dest.CPF._text,
				endereco: recipientAdress,
				email: jsonXML.dest.email._text
			};

			const orderInvoice: IInvoiceOrder = {
				servicoTipo: 1,
				entregaTipo: '0',
				peso: parseFloat(jsonXML.transp.vol.pesoB._text),
				volumes: jsonXML.transp.vol.qVol._text,
				condFrete: 'CIF',
				pedido: message.orderCRM,
				clienteCodigo: parseInt(message.orderERP),
				natureza: 'Emissao NF Ecommerc',
				icmsIsencao: 0,
				destinatario: recipient,
				docFiscal: {
					nfe: [taxDocE]
				}
			};

			const infoInvoice: IInvoiceTotalExpress = {
				remetenteId: 38386,
				cnpj: jsonXML.emit.CNPJ._text,
				remessaCodigo: message.orderCRM,
				encomendas: [orderInvoice]
			};

			const data: IDataInvoiceTotalExpress = {
				invoiceNumber: message.invoice,
				JSON: JSON.stringify(infoInvoice),
				status: statusEcommerceIntegration.toIntegration,
				createdAt: new Date(),
				updatedAt: new Date()
			};

			const getInvoice =
				await repository.GetInvoiceTotalExpressIntegration(
					message.invoice
				);

			let response;
			if (getInvoice.length > 0) {
				if (
					getInvoice[0].status != statusEcommerceIntegration.success
				) {
					response =
						await repository.PutInvoiceTotalExpressIntegration(
							data,
							getInvoice[0].id
						);
				}

				data.status = getInvoice[0].status;
			} else {
				response = await repository.PostInvoiceTotalExpressIntegration(
					data
				);

				data.status = statusEcommerceIntegration.toIntegration;
			}

			const sendInvoice: ISendInvoiceTotalExpress = {
				jsonInvoice: infoInvoice,
				dataInvoice: data
			};

			if (data.status != statusEcommerceIntegration.success) {
				await this.broker.broadcast(
					'service.totalexpress.invoice.PostInvoice',
					sendInvoice
				);
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
			apmElasticConnect
				.setTransactionName(this.indexName)
				.captureError(new Error(error.message))
				.endTransaction();
		}
	}
}
