export interface IConfigLogCrmIso {
	id?: number;
	orderId: string;
	name: string;
	status: string;
	description: string;
	dateTimeSav: Date;
	dateTimeEvt: Date;
	branchId: string | null;
	orderIdERP: string | null;
	errorType: number | null;
	userViewer: string | null;
}

export interface IIConfigLogCrmIso {
	id?: number;
	orderId: string;
	name: string;
	status: string;
	description: string;
}
