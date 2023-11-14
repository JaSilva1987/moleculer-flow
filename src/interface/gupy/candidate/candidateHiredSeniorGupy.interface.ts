export interface ICandidateHiredSeniorGupy {
	companyName: string;
	id: string;
	event: string;
	date: Date;
	data: IICandidateHiredSeniorGupy;
}

export interface IICandidateHiredSeniorGupy {
	job: IIICandidateHiredSeniorGupy;
	application: IVCandidateHiredSeniorGupy;
	candidate: VCandidateHiredSeniorGupy;
	user: VICandidateHiredSeniorGupy;
}

export interface IIICandidateHiredSeniorGupy {
	id: number;
	name: string;
	type: string;
	departmentCode: string;
	roleCode: string;
	branchCode: string;
	customFields: VIIICandidateHiredSeniorGupy[];
	department: IXCandidateHiredSeniorGupy;
	role: XCandidateHiredSeniorGupy;
	branch: XICandidateHiredSeniorGupy;
}

export interface IVCandidateHiredSeniorGupy {
	id: number;
	vacancyCode: string;
	score: number;
	partnerName: string;
	preHiringInformation: VIICandidateHiredSeniorGupy;
	tags: string[];
	hiringDate: Date;
	hiringType: string;
	currentStep: XIICandidateHiredSeniorGupy;
	salary: XIIICandidateHiredSeniorGupy;
}

export interface VCandidateHiredSeniorGupy {
	id: number;
	name: string;
	lastName: string;
	email: string;
	identificationDocument: string;
	countryOfOrigin: string;
	birthdate: string;
	addressZipCode: string;
	addressStreet: string;
	addressNumber: string;
	addressCity: string;
	addressState: string;
	addressStateShortName: string;
	addressCountry: string;
	addressCountryShortName: string;
	mobileNumber: string;
	phoneNumber: string;
	schooling: string;
	schoolingStatus: string;
	disabilities: boolean;
	gender: string;
}

export interface VICandidateHiredSeniorGupy {
	id: number;
	name: string;
	email: string;
	code: number;
}

export interface VIICandidateHiredSeniorGupy {}

export interface VIIICandidateHiredSeniorGupy {
	id: string;
	title: string;
	value: string;
}

export interface IXCandidateHiredSeniorGupy {
	id: number;
	code: string;
	name: string;
	similarity: string;
}

export interface XCandidateHiredSeniorGupy {
	id: number;
	code: string;
	name: string;
	similarity: string;
}

export interface XICandidateHiredSeniorGupy {
	id: number;
	code: string;
	name: string;
}

export interface XIICandidateHiredSeniorGupy {
	id: number;
	name: string;
	type: string;
}

export interface XIIICandidateHiredSeniorGupy {
	value: number;
	currency: string;
}

export interface TCandidateHiredSeniorGupy {
	status: number;
	message: object;
}
