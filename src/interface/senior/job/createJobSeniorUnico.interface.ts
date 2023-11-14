export interface ISeniorUnico {
	num_matricula?: string;
	limit_date: string;
	admission_date?: string;
	cost_center?: string;
	pos_number?: string;
	organization?: string;
	unit?: string;
	role: string;
	roleName?: string;
	department: string;
	departmentName?: string;
	pagamento: IISeniorUnico;
	deficiencia: boolean;
	jornada?: string;
	profile: IIISeniorUnico;
	exame?: IVSeniorUnico;
	docs?: string[];
	send_sms: boolean;
	send_email: boolean;
}

export interface IISeniorUnico {
	vinculo: string;
	valor?: string;
	recorrencia?: string;
	contaBancaria?: VSeniorUnico;
}

export interface VSeniorUnico {
	banco: string;
	carta: string;
}

export interface IIISeniorUnico {
	name: string;
	email: string;
	mobile: string;
}

export interface IVSeniorUnico {
	clinica: string;
	data?: string;
	hora?: string;
	obs?: string;
	guia?: string;
}

export interface TCreateJobSeniorUnico {
	message?: any;
	status?: number;
}

export interface IRoleUnico {
	acc: string;
	code: string;
	id: string;
	name: string;
}

export interface IDepartamentsUnico {
	acc: string;
	code: string;
	context: IIDepartamentsUnico;
	id: string;
	name: string;
}

export interface IIDepartamentsUnico {
	brazil: IIIDepartamentsUnico;
}

export interface IIIDepartamentsUnico {
	cbo: string;
	escolaridadeMinima: string;
}

export interface IControllerUnico {
	status: number;
	organization: string;
	unit: string;
	message: string;
}
