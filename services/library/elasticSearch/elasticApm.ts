import * as dotenv from 'dotenv';
import elasticAPM, { Agent } from 'elastic-apm-node';
import path from 'path';
import { environmentElastic } from './environment';
dotenv.config();

export const apmElasticConnect: Agent | any = elasticAPM.start({
	serviceName: process.env.ELASTIC_APM_SERVICE_NAME,
	secretToken: process.env.ELASTIC_APM_SECRET_TOKEN,
	serverUrl: process.env.ELASTIC_APM_SERVER_URL,
	environment: environmentElastic(),
	serverCaCertFile: path.join(__dirname, '../cert/elasticViveo/ca.crt'),
	verifyServerCert: false
});
