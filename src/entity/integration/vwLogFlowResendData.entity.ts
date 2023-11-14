import { ViewColumn, ViewEntity } from 'typeorm';

@ViewEntity({
	name: 'VWLogFlowResendData',
	expression: `select * from VWLogFlowResendData`
})
export class VWLogFlowResendDataEntity {
	@ViewColumn() orderId: string;

	@ViewColumn() data: Date;

	@ViewColumn() tenantId: string;

	@ViewColumn() sourceCRM: string;
}
