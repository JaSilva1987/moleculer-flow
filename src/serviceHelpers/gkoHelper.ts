//#region Global Imports
import { Context } from 'moleculer';
//#endregion Global Imports

export namespace gkoPostHelper {
	const prefix: string = 'flow-gko.postRequest';

	export const Post = async (ctx: Context, params: any): Promise<any> =>
		await ctx.call(`${prefix}.PostToGko`, params);
}
