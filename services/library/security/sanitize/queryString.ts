import { loggerElastic } from '../../elasticSearch';
export const chekUrlPath = (urlOrigin: string): boolean => {
	let isReturn = false;
	try {
		const urlOriginal = urlOrigin
			.replace(
				/^(?:(?:(?:f|ht)tps?|mailto|tel|callto|sms|cid|xmpp|xxx):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i,
				''
			)
			.toLowerCase();

		console.log('urlOriginal: ', urlOriginal);

		const termsToSearch = process.env.TERMS_TO_SEARCH.split(',').some(
			(agent) => {
				if (urlOriginal.includes(agent)) {
					console.log(
						'============== URL COM SUJEIRA: ' +
							agent +
							' =============='
					);
					loggerElastic(
						'flow-security',
						'406',
						'query-string',
						'chekUrlPath',
						urlOrigin,
						agent
					);

					isReturn = true;
				}
			}
		);

		loggerElastic(
			'flow-security',
			'406',
			'query-string',
			'chekUrlPath',
			urlOrigin,
			JSON.stringify(urlOriginal)
		);

		return isReturn;
	} catch (e) {
		loggerElastic(
			'flow-security',
			'499',
			'query-string',
			'chekUrlPath',
			urlOrigin,
			JSON.stringify(e.message)
		);

		return true;
	}
};
