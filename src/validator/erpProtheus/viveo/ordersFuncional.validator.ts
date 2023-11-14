import { Type, Static, TObject } from '@sinclair/typebox';

export const ordersFuncionalViveoSchema = Type.Object({
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

export type ordersFuncionalViveoSchemaType = Static<
	typeof ordersFuncionalViveoSchema
>;

export const ordersFuncionalResponseViveoSchema = Type.Object({
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

export type ordersFuncionalResponseViveoSchemaType = Static<
	typeof ordersFuncionalResponseViveoSchema
>;
