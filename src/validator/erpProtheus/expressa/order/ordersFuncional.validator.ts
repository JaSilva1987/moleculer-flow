import { Type, Static, TObject } from '@sinclair/typebox';

export const ordersFuncionalExpressaSchema = Type.Object({
	orders: Type.Array(
		Type.Object({
			code: Type.String(),
			message: Type.String(),
			detailedMessage: Type.String(),
			helpUrl: Type.String(),
			details: Type.Array(
				Type.Object({
					companyID: Type.String(),
					branchID: Type.String(),
					preAuthorizationCode: Type.String(),
					numberDeliveryOrder: Type.String()
				})
			)
		})
	)
});

export type ordersFuncionalExpressaSchemaType = Static<
	typeof ordersFuncionalExpressaSchema
>;

export const ordersFuncionalResponseExpressaSchema = Type.Object({
	code: Type.String(),
	message: Type.String(),
	detailedMessage: Type.String(),
	helpUrl: Type.String(),
	details: Type.Array(
		Type.Object({
			groupCompanyID: Type.String(),
			branchID: Type.String(),
			orderNumber: Type.String(),
			preAuthorizationCode: Type.String()
		})
	)
});

export type ordersFuncionalResponseExpressaSchemaType = Static<
	typeof ordersFuncionalResponseExpressaSchema
>;
