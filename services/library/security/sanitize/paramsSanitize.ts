import xss, { IFilterXSSOptions } from 'xss';
import { xmlToJSON } from '../../shared';

function sanitizeString(
	originalInput: string,
	xssOptions: IFilterXSSOptions
): string {
	const sanitizedInput = xss(originalInput, xssOptions);
	return sanitizedInput !== originalInput ? sanitizedInput : originalInput;
}

function sanitizeObject(
	input: object | string | any,
	xssOptions: IFilterXSSOptions
): boolean {
	let dirty = false;

	for (const key in input) {
		if (typeof input[key] === 'string') {
			const originalKey = input[key];
			input[key] = sanitizeString(input[key], xssOptions);
			if (input[key] !== originalKey) {
				dirty = true;
			}
		} else if (typeof input[key] === 'object') {
			dirty = sanitizeObject(input[key], xssOptions) || dirty;
		}
	}

	return dirty;
}

export function paramsSanitize(input: string | object | any): boolean {
	const xssOptions: IFilterXSSOptions = {
		whiteList: {},
		stripIgnoreTag: true,
		stripIgnoreTagBody: [],
		css: false,
		escapeHtml: (html: string) => html
	};

	if (typeof input === 'string') {
		const sanitizedInput = sanitizeString(input, xssOptions);
		return sanitizedInput !== input;
	}

	if (typeof input === 'object' && input !== null) {
		return sanitizeObject(input, xssOptions);
	}

	return false;
}

export function validateXml(ctx: any): boolean {
	const xmlBody = xmlToJSON(ctx.params.req.$params.body);
	return paramsSanitize(xmlBody);
}
