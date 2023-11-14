import * as dotenv from 'dotenv';
import elasticAPM from 'elastic-apm-node';
import { apmElasticConnect } from '../../../services/library/elasticSearch/elasticApm';

describe('::Testes ::APM Elastic', () => {
	it('deve iniciar o APM agent', () => {
		if (
			elasticAPM &&
			elasticAPM.isStarted &&
			typeof elasticAPM.isStarted === 'function'
		) {
			expect(elasticAPM.isStarted()).toBe(true);
		} else {
			fail('elasticAPM.isStarted is not defined');
		}
	});

	it('deve ter o nome de serviço correto', () => {
		expect(apmElasticConnect.getServiceName()).toBe(
			process.env.ELASTIC_APM_SERVICE_NAME
		);
	});
});
