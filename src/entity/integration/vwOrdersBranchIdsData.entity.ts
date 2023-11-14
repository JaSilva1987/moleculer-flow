import { ViewColumn, ViewEntity } from 'typeorm';

@ViewEntity({
	name: 'vw_orders_branchIds_data',
	expression: `select * from vw_orders_branchIds_data`
})
export class VWOrdersBranchIdsDataEntity {
	@ViewColumn() tenantId: string;
	@ViewColumn() branchId: string;
	@ViewColumn() sourceCRM: string;
	@ViewColumn() data: Date;
	@ViewColumn() hora: Date;
}
