('use strict');
import * as dotenv from 'dotenv';
import {
	Context,
	Errors,
	Service as MoleculerService,
	ServiceBroker,
	ServiceSchema
} from 'moleculer';
import { Action, Service } from 'moleculer-decorators';
import { AuthToken } from '../../../src/interface/library/auth/authorizationToken.interface';
import { connectionIntegrador } from '../../../src/data-source';
import { AuthenticationUsersEntity } from '../../../src/entity/integration/authenticationUsers.entity';
import { AuthenticationIntegrationLayer } from './authenticationIntegrationLayer.controller';
dotenv.config();
@Service({
	name: 'authorization.token',
	group: 'flow'
})
export default class AuthorizationService extends MoleculerService {
	public constructor(public broker: ServiceBroker, schema: ServiceSchema) {
		super(broker);
	}
	@Action({
		cache: false,
		rest: {
			method: 'POST',
			basePath: 'auth/',
			path: 'token'
		}
	})
	public async AuthorizationPost(ctxMessage: Context<AuthToken>) {
		const { username, password, refresh_token } = ctxMessage.params;
		const authService = new AuthenticationIntegrationLayer();
		if (refresh_token) {
			try {
				const validRefreshToken =
					await authService.validateIntegrationLayerRefreshToken(
						refresh_token
					);
				if (!validRefreshToken)
					throw 'Invalid refresh token, please validate it and retry';
				return await generateTokenData(authService);
			} catch (err: unknown) {
				return error(
					400,
					'Invalid refresh token, please validate it and retry'
				);
			}
		}

		const user = await connectionIntegrador
			.getRepository(AuthenticationUsersEntity)
			.findOneBy({ username: username });
		if (!user) return error(401, 'Invalid credentials, please check');

		const validPassword =
			await authService.validateIntegrationLayerPassword(
				password,
				user.password
			);
		if (!validPassword)
			return error(401, 'Invalid credentials, please check');

		return await generateTokenData(authService);
	}
}

const error = (code: number, message: string) => {
	throw new Errors.MoleculerError(message, code);
};

const generateTokenData = async (
	authService: AuthenticationIntegrationLayer
) => {
	const accessToken = await authService.generateIntegrationLayerAccessToken();
	const refreshToken =
		await authService.generateIntegrationLayerRefreshToken();
	return {
		viveo: {
			code: 200,
			access_token: accessToken,
			refresh_token: refreshToken,
			scope: 'default',
			token_type: 'Bearer',
			expires_in: process.env.JWT_ACCESS_TOKEN_EXPIRES_IN
		}
	};
};
