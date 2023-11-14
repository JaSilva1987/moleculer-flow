export interface IUnicoSenior {
	integration: string;
	position: string;
	'position-number': string;
	unit: string;
	event: string;
}

export interface Status {
	code: number;
	name: string;
}

export interface IUnicoStatus {
	status: number;
	message: string;
}
