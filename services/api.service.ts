import compression from 'compression';
import Cryptr from 'cryptr';
import * as dotenv from 'dotenv';
import helmet from 'helmet';
import hpp from 'hpp';
import { IncomingMessage } from 'http';
import { Context, Errors, Service, ServiceBroker } from 'moleculer';
import ApiGateway, {
	GatewayResponse,
	IncomingRequest,
	Route
} from 'moleculer-web';
import 'reflect-metadata';
import { ISanitize } from '../src/interface/library/security/sanitize.interface';
import { Meta } from '../src/interface/library/security/userAgent.interface';
import { AuthenticationIntegrationLayer } from './library/auth/authenticationIntegrationLayer.controller';
import { loggerElastic } from './library/elasticSearch';
import { isOnBefore, isPostBefore } from './library/security/onBeforeCall';
import { validateXml } from './library/security/sanitize/paramsSanitize';
const E = require('moleculer-web').Errors;

dotenv.config();
export default class ApiService extends Service {
	public constructor(broker: ServiceBroker) {
		super(broker);

		this.parseServiceSchema({
			name: 'Flow',
			mixins: [ApiGateway],
			// More info about settings: https://moleculer.services/docs/0.14/moleculer-web.html
			settings: {
				port: process.env.PORT || 9146,

				cors: {
					methods: ['POST', 'PUT', 'GET'],
					origin: [
						'api.viveo.com.br',
						'integration.layer.mafra.intra'
					],
					allowedHeaders: [
						'Content-Type',
						'Authorization',
						'Content-Security-Policy',
						'X-XSS-Protection',
						'X-Content-Type-Options'
					],
					credentials: true,
					maxAge: 3600
				},

				rateLimit: {
					window: 2 * 1000,
					limit: 200,
					headers: true
				},

				use: [
					helmet({
						contentSecurityPolicy: false,
						crossOriginEmbedderPolicy: true,
						crossOriginOpenerPolicy: true,
						crossOriginResourcePolicy: true,
						dnsPrefetchControl: false,
						expectCt: false,
						frameguard: {
							action: 'deny'
						},
						hidePoweredBy: false,
						hsts: true,
						ieNoOpen: true,
						noSniff: true,
						originAgentCluster: false,
						permittedCrossDomainPolicies: false,
						referrerPolicy: { policy: 'no-referrer' },
						xssFilter: true
					}),
					hpp({
						checkBody: true,
						checkQuery: true
					}),
					compression()
				],

				routes: [
					{
						whitelist: process.env.ARRAY_ACCESS_ACTIONS_WHITELIST,

						bodyParsers: {
							json: {
								strict: true,
								limit: '2MB'
							},
							urlencoded: {
								extended: true,
								limit: '2MB'
							}
						},
						mergeParams: true,
						authentication: true,
						authorization: true,
						autoAliases: true,
						aliases: {},

						cors: {
							origin: [
								'api.viveo.com.br',
								'integration.layer.mafra.intra'
							],
							methods: ['GET', 'POST', 'PUT']
						},

						path: '/flow',

						onBeforeCall(
							ctx: Context<unknown, any, Meta>,
							route: Route,
							req: IncomingRequest,
							res: GatewayResponse
						) {
							ctx.meta = req.headers;

							if (!req.originalUrl.includes('health')) {
								const isInvalid: boolean = isOnBefore(ctx, req);

								if (isInvalid) {
									return Promise.reject(
										new Errors.MoleculerError(
											'Not Acceptable',
											406
										)
									);
								}

								if (
									(!isInvalid && req.method === 'POST') ||
									(!isInvalid && req.method === 'PUT')
								) {
									const invalidBody: boolean =
										isPostBefore(ctx);

									if (invalidBody) {
										loggerElastic(
											'flow-security',
											'400',
											'ApiService',
											'invalidBody',
											JSON.stringify(
												(ctx as ISanitize).params.req
													.body
											),
											JSON.stringify(invalidBody)
										);

										return Promise.reject(
											new Errors.MoleculerError(
												(ctx as ISanitize).params.req
													.body as string,
												400
											)
										);
									}
								}
							}
						}
					},
					{
						whitelist:
							process.env.ARRAY_ACCESS_ACTIONS_WHITELIST_XML,

						bodyParsers: {
							json: {
								strict: false,
								limit: '2MB'
							},
							urlencoded: {
								extended: true,
								limit: '2MB'
							},
							text: {
								type: 'application/xml'
							}
						},
						mergeParams: false,
						authentication: false,
						authorization: true,
						autoAliases: false,
						aliases: JSON.parse(process.env.JSON_ALIASES_XML),
						cors: {
							origin: [
								'api.viveo.com.br',
								'integration.layer.mafra.intra'
							],
							methods: ['POST']
						},

						onBeforeCall(
							ctx: Context<unknown, Meta>,
							route: Route,
							req: IncomingRequest,
							res: GatewayResponse
						) {
							if (!req.originalUrl.includes('health')) {
								const isValid: boolean = isOnBefore(ctx, req);

								if (isValid) {
									return Promise.reject(
										new Errors.MoleculerError(
											'Not Acceptable',
											406
										)
									);
								}

								const invalidBody = validateXml(ctx);

								if (invalidBody) {
									loggerElastic(
										'flow-security',
										'400',
										'ApiService',
										'invalidBody',
										JSON.stringify(
											(ctx as ISanitize).params.req.body
										),
										JSON.stringify(invalidBody)
									);

									return Promise.reject(
										new Errors.MoleculerError(
											(ctx as ISanitize).params.req
												.body as string,
											400
										)
									);
								}
							}
						},

						path: '/flow/xml'
					},
					{
						path: '/flow/alcis',

						whitelist: {},

						cors: {
							methods: ['POST'],

							credentials: false
						},

						aliases: {
							'POST auth/token ':
								'authorization.token.AuthorizationPost'
						},

						use: [
							helmet({
								contentSecurityPolicy: false,

								crossOriginEmbedderPolicy: true,

								crossOriginOpenerPolicy: true,

								crossOriginResourcePolicy: true,

								dnsPrefetchControl: false,

								expectCt: false,

								frameguard: {
									action: 'deny'
								},

								hidePoweredBy: false,

								hsts: true,

								ieNoOpen: true,

								noSniff: true,

								originAgentCluster: false,

								permittedCrossDomainPolicies: false,

								referrerPolicy: { policy: 'no-referrer' },

								xssFilter: true
							})
						],

						mergeParams: true,

						authentication: false,

						authorization: false,

						autoAliases: false
					}
				],

				mappingPolicy: 'restrict',

				logging: true,
				// Do not log client side errors (does not log an error response when the error.code is 400<=X<500)
				log4XXResponses: false,
				// Logging the request parameters. Set to any log level to enable it. E.g. "info"
				logRequestParams: 'infog',
				// Logging the response data. Set to any log level to enable it. E.g. "info"
				logResponseData: 'info'
			},

			methods: {
				authorize(
					ctx: Context,
					route: any,
					req: IncomingMessage
				): Promise<any> {
					// Read the token from header
					const auth = req.headers.authorization;
					const cryptr = new Cryptr(process.env.AUTHENTICATION_TOKEN);
					if (auth && auth.startsWith('Bearer')) {
						const token = auth.slice(7);
						if (token.length > 280) {
							const validAccessToken =
								new AuthenticationIntegrationLayer().validateIntegrationLayerAccessToken(
									token
								);
							if (!validAccessToken) {
								return Promise.reject(
									new E.UnAuthorizedError(E.ERR_INVALID_TOKEN)
								);
							}
							return Promise.resolve(ctx);
						}
						const authToken =
							token !== process.env.AUTHENTICATION_TOKEN
								? cryptr.decrypt(token)
								: token;
						// Check the token
						if (
							token == process.env.AUTHENTICATION_TOKEN ||
							authToken == process.env.AUTHENTICATION_TOKEN
						) {
							return Promise.resolve(ctx);
						} else {
							// Invalid token
							return Promise.reject(
								new E.UnAuthorizedError(E.ERR_INVALID_TOKEN)
							);
						}
					} else {
						// No token
						return Promise.reject(
							new E.UnAuthorizedError(E.ERR_NO_TOKEN)
						);
					}
				}
			}
		});
	}
}
