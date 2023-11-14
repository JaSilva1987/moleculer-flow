import { Client } from '@elastic/elasticsearch';
import * as dotenv from 'dotenv';
import fs from 'fs';
import { DateTime } from 'luxon';
import { ServiceBroker } from 'moleculer';
import path from 'path';
import { environmentElastic } from './environment';
dotenv.config();

const broker: ServiceBroker = new ServiceBroker();

const elasticClient: Client = new Client({
	node: process.env.ELASTIC_ID || '',
	auth: {
		username: process.env.ELASTIC_USER || '',
		password: process.env.ELASTIC_PASS || ''
	},
	tls: {
		ca: fs.readFileSync(
			path.resolve('./services/library/cert/elasticViveo/', 'ca.crt')
		),
		rejectUnauthorized: false
	}
});

export async function loggerElastic(
	indexName: string,
	statusOperation: string,
	originLayer: string,
	serviceName: string,
	requestService: string,
	responseService?: string
): Promise<void> {
	try {
		const timestamp = DateTime.local().setZone('America/Sao_Paulo').toISO();

		await elasticClient.index({
			index: indexName.toLowerCase(),
			body: {
				'@timestamp': timestamp,
				status: statusOperation,
				origin: originLayer.toLowerCase(),
				environment: environmentElastic(),
				service: serviceName.toLowerCase(),
				request: requestService,
				response: responseService
			}
		});

		await elasticClient.indices.refresh({ index: indexName });
	} catch (error) {
		broker.logger.error(
			`ERROR WHILE INSERTING DATA INTO ELASTIC: ${error.message}`
		);
	}
}
