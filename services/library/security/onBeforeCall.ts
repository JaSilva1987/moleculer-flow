import { loggerElastic } from '../elasticSearch';
import { Context } from 'moleculer';
import { Meta } from '../../../src/interface/library/security/userAgent.interface';
import { IncomingRequest } from 'moleculer-web';
import { checkAgent } from './sanitize/userAgent';
import { chekUrlPath } from './sanitize/queryString';
import { paramsSanitize } from './sanitize/paramsSanitize';
import { ISanitize } from '../../../src/interface/library/security/sanitize.interface';

export function isOnBefore(
	ctx: Context<unknown, Meta>,
	req: IncomingRequest
): boolean {
	try {
		let isValidations: boolean = false;
		const checkUserAgent: boolean = checkAgent(req.headers['user-agent']);

		if (checkUserAgent) {
			isValidations = true;
			console.log('============== TEM AGENTE SUSPEITO!!! ==============');
		}
		const checkQueryString: boolean = chekUrlPath(req.originalUrl);

		if (checkQueryString) {
			isValidations = true;
		}

		loggerElastic(
			'flow-security',
			'200',
			'validation-agent',
			'isOnBefore',
			JSON.stringify((ctx as ISanitize).params.req.body),
			JSON.stringify(checkQueryString)
		);

		return isValidations;
	} catch (error) {
		loggerElastic(
			'flow-security',
			'200',
			'validation-agent',
			'checkAgent',
			JSON.stringify(req),
			JSON.stringify(error.message)
		);

		return true;
	}
}

export function isPostBefore(ctx: Context<unknown, Meta>): boolean {
	try {
		let isValidations: boolean = false;

		const sanitizeParams: boolean = paramsSanitize(
			(ctx as ISanitize).params.req.body
		);

		if (sanitizeParams) {
			isValidations = true;
			console.log(
				'============== TEM BODY COM SUJEIRA!!! =============='
			);
		}

		loggerElastic(
			'flow-security',
			'200',
			'validation-post',
			'isPostBefore',
			JSON.stringify((ctx as ISanitize).params.req.body),
			JSON.stringify(sanitizeParams)
		);

		return isValidations;
	} catch (error) {
		loggerElastic(
			'flow-security',
			'499',
			'validation-post',
			'isPostBefore',
			JSON.stringify((ctx as ISanitize).params.req.body),
			JSON.stringify(error.message)
		);

		return true;
	}
}
