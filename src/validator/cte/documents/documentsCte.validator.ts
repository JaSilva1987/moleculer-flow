import { Static, Type } from '@sinclair/typebox';

export const documentsOneCteSchema = Type.Object({
	data: Type.Array(
		Type.Object({
			senderFederalID: Type.String(),
			senderName: Type.String(),
			notifyEndpoint: Type.Optional(Type.String()),
			documents: Type.Array(
				Type.Object({
					documentSerie: Type.String(),
					document: Type.String(),
					documentFederalKey: Type.String(),
					submissionDate: Type.String(),
					issueDate: Type.String(),
					operationTaxCode: Type.String(),
					freightType: Type.String(),
					transportType: Type.Optional(Type.String()),
					packages: Type.Number(),
					value: Type.Number(),
					weight: Type.Number(),
					addresseeFederalID: Type.String(),
					addresseeStateTaxRegistrationNumber: Type.String(),
					addresseeName: Type.String(),
					addresseeAddress: Type.String(),
					addresseeAddressNumber: Type.String(),
					addresseeNeighbourhood: Type.String(),
					addresseeCityCode: Type.String(),
					addresseeCity: Type.String(),
					addresseeCEP: Type.String(),
					addresseeState: Type.String(),
					addresseeCountryBACENode: Type.String(),
					addresseeCountryIBGECode: Type.String(),
					addresseeDDDPhone: Type.String(),
					addresseePhone: Type.String(),
					addresseeMail: Type.String(),
					cteDocument: Type.String(),
					cteSerie: Type.String(),
					cteType: Type.String(),
					cteFederalKey: Type.String(),
					receiverFederalID: Type.Optional(Type.String()),
					receiverName: Type.Optional(Type.String()),
					receiverAddress: Type.Optional(Type.String()),
					receiverAddressNumber: Type.Optional(Type.String()),
					receiverNeighbourhood: Type.Optional(Type.String()),
					receiverCityCode: Type.Optional(Type.String()),
					receiverCity: Type.Optional(Type.String()),
					receiverCEP: Type.Optional(Type.String()),
					receiverState: Type.Optional(Type.String()),
					receiverCountryBACENode: Type.Optional(Type.String()),
					receiverCountryIBGECode: Type.Optional(Type.String()),
					receiverMail: Type.Optional(Type.String()),
					receiverPhone: Type.Optional(Type.String()),
					receiverDDDPhone: Type.Optional(Type.String()),
					receiverStateTaxRegistrationNumber: Type.Optional(
						Type.String()
					)
				})
			)
		})
	)
});

export const documentsTwoCteSchema = Type.Object({
	data: Type.Array(
		Type.Object({
			senderFederalID: Type.String(),
			senderName: Type.String(),
			notifyEndpoint: Type.String(),
			documents: Type.Array(
				Type.Object({
					xmlType: Type.String(),
					xmlContent: Type.String()
				})
			)
		})
	)
});

export type documentsOneCteSchemaType = Static<typeof documentsOneCteSchema>;
export type documentsTwoCteSchemaType = Static<typeof documentsTwoCteSchema>;
