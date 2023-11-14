export interface ISanitize {
	meta: unknown;
	params: {
		req: {
			query: unknown;
			body: unknown;
			params: unknown;
			originalUrl: unknown;
		};
	};
}
