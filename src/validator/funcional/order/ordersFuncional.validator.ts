import { Type, Static } from '@sinclair/typebox';

export const ordersFuncionalSchema = Type.Object({
	orders: Type.Array(
		Type.Object({
			customerName: Type.String(),
			preAuthorizationCode: Type.String(),
			notifyEndpoint: Type.String(),
			items: Type.Array(
				Type.Object({
					productEAN: Type.String(),
					productCode: Type.String(),
					quantity: Type.Number()
				})
			)
		})
	)
});

export const ordersNewFuncionalSchema = Type.Object({
	orders: Type.Array(
		Type.Object({
			companyID: Type.String(),
			branchID: Type.String(),
			customerID: Type.String(),
			branchCustomer: Type.String(),
			sequenceAddress: Type.String(),
			customerName: Type.String(),
			preAuthorizationCode: Type.String(),
			notifyEndpoint: Type.String(),
			items: Type.Array(
				Type.Object({
					productEAN: Type.String(),
					productCode: Type.String(),
					quantity: Type.Number()
				})
			)
		})
	)
});

export type ordersFuncionalSchemaType = Static<typeof ordersFuncionalSchema>;

export type ordersNewFuncionalSchemaType = Static<
	typeof ordersNewFuncionalSchema
>;
