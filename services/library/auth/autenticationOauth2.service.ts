import * as dotenv from 'dotenv';
import fs from 'fs';
import jwt from 'jsonwebtoken';
import { Service as MoleculerService, ServiceBroker } from 'moleculer';
import { Event, Service } from 'moleculer-decorators';
import path from 'path';
import qs from 'querystring';
import { IGenerateServiceOauth2 } from '../../../src/interface/senior/auth/autenticationToken.interface';
import { AxiosRequest } from '../axios';
import { loggerElastic } from '../elasticSearch';

dotenv.config();

@Service({
	name: 'authorization.oauth2',
	group: 'flow'
})
export default class OAuth2Service extends MoleculerService {
	indexName = 'flow-senior';
	isCode = '200';
	originLayer = 'controller';
	serviceName = 'OAuth02';
	urlToken = '';
	grantUse = '';

	public constructor(public broker: ServiceBroker) {
		super(broker);
	}

	@Event({
		name: 'library.oauth2',
		group: 'flow-library'
	})
	public async oAuthTwo(oAuth2: IGenerateServiceOauth2) {
		try {
			this.urlToken = oAuth2.basePath + oAuth2.params;
			this.grantUse = oAuth2.grantType;

			const newToken = await this.requestAnAccessToken(
				await this.createServiceAccountToken(oAuth2),
				(accessToken: string, oAuth2: IGenerateServiceOauth2) => {
					let payload = jwt.decode(accessToken);
					this.logger.info('Response:' + payload);
				}
			);

			return newToken;
		} catch (error) {
			loggerElastic(
				this.indexName,
				this.isCode,
				this.originLayer,
				this.serviceName,
				JSON.stringify(oAuth2),
				JSON.stringify('Erro: ' + error)
			);
		}
	}

	public async createServiceAccountToken(oAuth2: IGenerateServiceOauth2) {
		try {
			let privateKey = fs.readFileSync(path.resolve(oAuth2.cert));

			let payload = {
				iss: oAuth2.iss,
				aud: oAuth2.basePath,
				scope: '*',
				exp: Math.floor(Date.now() / 1000) + 3600,
				iat: Math.floor(Date.now() / 1000)
			};
			return jwt.sign(payload, privateKey, {
				algorithm: 'RS256'
			});
		} catch (error) {
			loggerElastic(
				this.indexName,
				this.isCode,
				this.originLayer,
				this.serviceName,
				JSON.stringify(oAuth2),
				JSON.stringify('Erro: ' + error)
			);
		}
	}

	public async requestAnAccessToken(serviceToken: string, oAuth2: any) {
		try {
			const sendGenerate = {
				method: 'post',
				maxBodyLength: Infinity,
				url: this.urlToken,
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded'
				},
				data: qs.stringify({
					grant_type: this.grantUse,
					assertion: serviceToken
				})
			};

			const sendAuth = await AxiosRequest(sendGenerate);

			return sendAuth;
		} catch (error) {
			loggerElastic(
				this.indexName,
				'499',
				this.originLayer,
				this.serviceName,
				JSON.stringify(oAuth2),
				JSON.stringify('Erro: ' + error)
			);
			loggerElastic(
				this.indexName,
				this.isCode,
				this.originLayer,
				this.serviceName,
				JSON.stringify(serviceToken),
				JSON.stringify('Erro: ' + error)
			);
		}
	}
}
