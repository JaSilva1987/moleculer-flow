('use strict');

import { Service as MoleculerService, ServiceBroker } from 'moleculer';
import { Event, Service } from 'moleculer-decorators';
import { TSeniorGupy } from '../../../src/enum/senior/enum';
import { ICandidateHiredSeniorGupy } from '../../../src/interface/gupy/candidate/candidateHiredSeniorGupy.interface';
import {
	ITokenSenior,
	JSONTokenSenior
} from '../../../src/interface/senior/job/createJobSeniorGupy.interface';
import { axiosInterceptors } from '../../library/axios/axiosInterceptos';
import { apmElasticConnect, loggerElastic } from '../../library/elasticSearch';

@Service({
	name: 'senior.gupy.senior.candidatehired',
	group: 'flow-senior'
})
export default class CandidateHiredService extends MoleculerService {
	returnResponse: object;
	indexName = 'flow-senior';
	isCode = '200';
	originLayer = 'senior';
	serviceName = 'CandidateHiredService';

	public constructor(public broker: ServiceBroker) {
		super(broker);
	}

	@Event({
		name: 'senior.gupy.post.candidatehired',
		group: 'flow-senior'
	})
	public async PostCandidateHiredSeniorGupy(
		gupySerniorCandidate: ICandidateHiredSeniorGupy
	) {
		try {
			const refreshToken = {
				objtRequest: {
					method: 'post',
					maxBodyLength: Infinity,
					url:
						process.env.SENIOR_URLBASE_TOKEN +
						process.env.SENIOR_TOKEN_HIRED,
					headers: {
						[process.env.CONTENT_TYPE_NAME]:
							process.env.CONTENT_TYPE,
						Cookie: process.env.SENIOR_COKIE
					},
					data: JSON.stringify({
						username: process.env.SENIOR_USER_TOKEN,
						password: process.env.SENIOR_PASS_TOKEN
					})
				}
			};

			const generateToken: ITokenSenior = await axiosInterceptors(
				refreshToken
			);
			const validToken: JSONTokenSenior = JSON.parse(
				generateToken.jsonToken
			);

			if (validToken.access_token) {
				const objRequest = {
					objtRequest: {
						method: 'post',
						maxBodyLength: Infinity,
						url:
							process.env.SENIOR_URLBASE +
							process.env.SENIOR_URL_HIREDCANDIDATE,
						headers: {
							Authorization: 'Bearer ' + validToken.access_token,
							[process.env.CONTENT_TYPE_NAME]:
								process.env.CONTENT_TYPE,
							[process.env.SENIOR_BPM]:
								process.env.SENIOR_BPM_USER
						},
						data: JSON.stringify(gupySerniorCandidate)
					}
				};

				this.returnResponse = await axiosInterceptors(objRequest);

				loggerElastic(
					this.indexName,
					this.isCode,
					this.originLayer,
					this.serviceName,
					JSON.stringify(objRequest),
					JSON.stringify(this.returnResponse)
				);
			}

			this.logger.info(
				'=============================  WEBHOOK HIRED CANDIDATE GUPY ==========================\n' +
					JSON.stringify(this.returnResponse, null, 2)
			);

			return this.returnResponse;
		} catch (error) {
			loggerElastic(
				this.indexName,
				'499',
				this.originLayer,
				this.serviceName,
				JSON.stringify(gupySerniorCandidate),
				JSON.stringify(error.message)
			);

			apmElasticConnect
				.setTransactionName(this.indexName)
				.captureError(new Error(error.message))
				.endTransaction([error]);

			return {
				erroExecucao: {
					'xsi:nil': Boolean(TSeniorGupy.xsiNil),
					'xmlns:xsi': TSeniorGupy.xmlnsXsi
				},
				status: TSeniorGupy.notFound
			};
		}
	}
}
