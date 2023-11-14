export interface ICreateJobSeniorGupy {
	customFields: Array<object>;
	name: string;
	type: string;
	code: string;
	codeRole?: string;
	codeBranch?: string;
	codeDepartament?: string;
	numVacancies: number;
	departmentId: number;
	departmentName?: string;
	roleId: number | string;
	branchId: number;
	branchName?: string;
	salary: ISCreateJobSeniorGupy;
	similarRole?: string;
	similardepartment?: string;
	addressCountry?: string;
	addressCountryShortName?: string;
	addressState?: string;
	addressStateShortName?: string;
	addressCity?: string;
	addressStreet?: string;
	addressNumber?: string;
	addressZipCode?: string;
	publicationType: string;
	description: string;
	responsibilities: string;
	prerequisites: string;
	reason: string;
}

export interface IICreateJobSeniorGupy {
	results?: Array<object>;
	totalResults?: number;
	page?: number;
	totalPages?: number;
	title?: string;
	detail?: string;
	status?: number;
	data?: IVCreateJobSeniorGupy;
	code?: string;
	createdAt?: string;
	id?: number;
	name?: string;
	similarTo?: string;
	updatedAt?: string;
}

export interface IIICreateJobSeniorGupy {
	id?: number;
	name?: string;
	code?: string;
	similarTo?: string;
	createdAt?: string;
	updatedAt?: string;
}

export interface IVCreateJobSeniorGupy {
	path: Array<object>;
	roleId: number;
	departmentId: number;
	branchId: number;
}

export interface TCreateJobSeniorGupy {
	status: number;
	message: object;
	detail: string;
}

export interface ITokenSenior {
	jsonToken: string;
}

export interface JSONTokenSenior {
	version: string;
	scope: string;
	expires_in: string;
	username: string;
	token_type: string;
	access_token: string;
	refresh_token: string;
}

export interface ISCreateJobSeniorGupy {
	currency: string;
	startsAt: number;
}
