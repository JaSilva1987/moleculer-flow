('use strict');

import {
	Service as MoleculerService,
	ServiceBroker,
	Context,
	Errors
} from 'moleculer';
import {
	IGetOrdersFuncional,
	IOrdersFuncional
} from '../../../src/interface/funcional/order/ordersFuncional.interface';
import * as dotenv from 'dotenv';
import {
	ordersFuncionalSchema,
	ordersFuncionalSchemaType
} from '../../../src/validator/funcional/order/ordersFuncional.validator';
import { validatorFactory } from '../../../src/validator/validator';
import { TreatmentFuncional } from '../../../src/enum/funcional/enum';
import { apmElasticConnect, loggerElastic } from '../../library/elasticSearch';
dotenv.config();

export default class OrdersFuncionalService extends MoleculerService {
	objectReturn: object;
	isAuthoriz: Array<object>;
	indexName = 'flow-funcional-orders';
	isCode = '200';
	originLayer = 'funcional';
	serviceNamePost = 'OrdersFuncionalService OrdersPost';
	serviceNameGet = 'OrdersFuncionalService OrdersGet';
	serviceNamePut = 'OrdersFuncionalService OrdersPut';
	public constructor(public broker: ServiceBroker) {
		super(broker);
		this.parseServiceSchema({
			name: 'funcional.orders',
			group: 'flow-funcional',
			actions: {
				post: {
					cache: false,
					rest: {
						method: 'POST',
						basePath: 'orders/',
						path: 'funcional/'
					},
					async handler(ctxMessage: Context<IOrdersFuncional>) {
						return await this.OrdersPost(ctxMessage);
					}
				},
				get: {
					cache: false,
					rest: {
						method: 'GET',
						basePath: 'orders/',
						path: 'funcional/'
					},
					querystring: {
						groupId: { type: 'string', min: 2, max: 2 },
						pageNumber: { type: 'string', min: 2, max: 2 },
						pageSize: { type: 'string', min: 1 },
						preAuthorizationCode: {
							type: 'string',
							min: 1,
							max: 20
						},
						internalOrder: { type: 'string', min: 1 },
						salesERPOrder: { type: 'string', min: 1 },
						isRange: { type: 'string', min: 1 },
						salesInternal: { type: 'string', min: 1 },
						dateTimeUpdate: { type: 'string', min: 18 }
					},
					async handler(ctxMessage: Context<IGetOrdersFuncional>) {
						return await this.OrdersGet(ctxMessage);
					}
				}
			}
		});
	}

	public async OrdersPost(ctxParams: Context<IOrdersFuncional>) {
		try {
			const ctxMessage = ctxParams.params;
			const orderValidation = validatorFactory<ordersFuncionalSchemaType>(
				ordersFuncionalSchema
			);
			const bodyRecived = ctxMessage as ordersFuncionalSchemaType;
			const validateJson = orderValidation.verify(bodyRecived);

			if (validateJson != undefined) {
				this.isAuthorize = await this.broker.emit(
					'funcional.integration.post.orders',
					ctxMessage
				);

				this.isAuthorize.forEach((moneyValid: object[]) => {
					for (const isReturn of moneyValid) {
						this.objectReturn = {
							viveo: isReturn
						};
					}
				});
				return this.objectReturn;
			} else {
				throw new Errors.MoleculerError(
					TreatmentFuncional.parameter_consult,
					421
				);
			}
		} catch (error) {
			loggerElastic(
				this.indexName,
				error.code,
				this.originLayer,
				this.serviceNamePost,
				JSON.stringify(ctxParams.params),
				JSON.stringify(error.message)
			);
			apmElasticConnect.captureError(new Error(error.message));
			throw new Errors.MoleculerError(error.message, error.code);
		}
	}

	public async OrdersGet(ctxParams: Context<IGetOrdersFuncional>) {
		try {
			const ctxMessage = ctxParams.params;

			if (ctxMessage.groupId) {
				this.isAuthorize = await this.broker.emit(
					'funcional.integration.get.orders',
					ctxMessage
				);

				this.isAuthorize.forEach((protheusTotvs: object) => {
					this.objectReturn = protheusTotvs;
				});
				loggerElastic(
					this.indexName,
					this.isCode,
					this.originLayer,
					this.serviceNameGet,
					JSON.stringify(ctxParams.params),
					JSON.stringify(this.objectReturn)
				);
				return this.objectReturn;
			} else {
				return {
					viveo: {
						status: 401,
						message: TreatmentFuncional.funcional_groupid
					}
				};
			}
		} catch (error) {
			loggerElastic(
				this.indexName,
				error.code,
				this.originLayer,
				this.serviceNameGet,
				JSON.stringify(ctxParams.params),
				JSON.stringify(error.message)
			);
			apmElasticConnect.captureError(new Error(error.message));
			throw new Errors.MoleculerError(error.message, error.code);
		}
	}
}
