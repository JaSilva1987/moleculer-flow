import fs from 'fs';
import * as dotenv from 'dotenv';
import jwt, { JsonWebTokenError } from 'jsonwebtoken';
dotenv.config();

export class AuthenticationIntegrationLayer {
	privateKey = fs.readFileSync(
		'./services/library/cert/integrationLayer/integrationLayer.key',
		'utf8'
	);
	saltRounds: 10;

	public async generateIntegrationLayerAccessToken(): Promise<string> {
		try {
			const accessToken = jwt.sign(
				{ stage: process.env.STAGE },
				this.privateKey,
				{
					expiresIn: +process.env.JWT_ACCESS_TOKEN_EXPIRES_IN,
					algorithm: 'RS256',
					subject: process.env.JWT_ACCESS_TOKEN_SUB
				}
			);
			if (!accessToken)
				throw new JsonWebTokenError('Failed to generate token');
			return accessToken;
		} catch (error) {
			console.error(error);
			throw error;
		}
	}

	public async generateIntegrationLayerRefreshToken(): Promise<string> {
		try {
			const refreshToken = jwt.sign(
				{ stage: process.env.STAGE },
				this.privateKey,
				{
					expiresIn: +process.env.JWT_REFRESH_TOKEN_EXPIRES_IN,
					algorithm: 'RS256',
					subject: process.env.JWT_REFRESH_TOKEN_SUB
				}
			);
			if (!refreshToken)
				throw new JsonWebTokenError('Failed to generate token');
			return refreshToken;
		} catch (error) {
			console.error(error);
			throw error;
		}
	}

	public validateIntegrationLayerAccessToken(token: string): boolean {
		try {
			const decodedAccessToken = jwt.verify(token, this.privateKey, {
				algorithms: ['RS256']
			});
			if (!decodedAccessToken || typeof decodedAccessToken === 'string')
				throw new JsonWebTokenError('Invalid access token');

			if (decodedAccessToken.sub !== process.env.JWT_ACCESS_TOKEN_SUB)
				throw new JsonWebTokenError('Invalid access token');

			if (decodedAccessToken.stage !== process.env.STAGE)
				throw new JsonWebTokenError('Invalid refresh token');

			return true;
		} catch (error: unknown) {
			return false;
		}
	}

	public async validateIntegrationLayerRefreshToken(
		token: string
	): Promise<boolean> {
		try {
			const decodedRefreshToken = jwt.verify(token, this.privateKey, {
				algorithms: ['RS256']
			});
			if (!decodedRefreshToken || typeof decodedRefreshToken === 'string')
				throw new JsonWebTokenError('Invalid refresh token');

			if (decodedRefreshToken.sub !== process.env.JWT_REFRESH_TOKEN_SUB)
				throw new JsonWebTokenError('Invalid refresh token');

			if (decodedRefreshToken.stage !== process.env.STAGE)
				throw new JsonWebTokenError('Invalid refresh token');

			return true;
		} catch (error: unknown) {
			console.error(error);
			if (error instanceof JsonWebTokenError) throw error.message;
			throw error;
		}
	}

	public async validateIntegrationLayerPassword(
		password: string,
		dbPassword: string
	): Promise<boolean> {
		try {
			const validPassword = password == dbPassword;
			return validPassword;
		} catch (error: unknown) {
			console.error(error);
			throw error;
		}
	}
}
