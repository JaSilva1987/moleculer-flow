import { ViewColumn, ViewEntity } from 'typeorm';
@ViewEntity({
	name: 'macroisopvtransacaocartao',
	expression: `SELECT * FROM macroisopvtransacaocartao`
})
export class MacroIsoPvTransacaoCartaoEntity {
	@ViewColumn() ZPT110_ZPT_FILIAL: number;

	@ViewColumn() ZPT110_ZPT_NUM: number;

	@ViewColumn() ZPT110_ZPT_SEQ: number;

	@ViewColumn() ZPT110_ZPT_CODCTR: string;

	@ViewColumn() ZPT110_ZPT_TAXA: number;

	@ViewColumn() ZPT110_ZPT_VALOR: number;

	@ViewColumn() ZPT110_ZPT_PDV: string;

	@ViewColumn() ZPT110_ZPT_NSU: string;

	@ViewColumn() ZPT110_ZPT_NSUHST: string;

	@ViewColumn() ZPT110_ZPT_BANDEI: number;

	@ViewColumn() ZPT110_ZPT_DATA: string;

	@ViewColumn() ZPT110_ZPT_HORA: string;

	@ViewColumn() ZPT110_ZPT_CNPJC: string;
}
