import { ITriangulationTypeIntegration } from '../../integration/type/triangulatioTypeIntegration.interface';

export interface ITriangulationTypePfs {
	CODIGO: string;
	DESCRICAO: string;
	CNPJ: string;
}

export interface ISendTriangulationTypePfs {
	sendJson: ITriangulationTypePfs;
	data: ITriangulationTypeIntegration;
}
