import { loggerElastic } from '../../elasticSearch';
import useragent from 'useragent';

export const checkAgent = (agentCheck: string): boolean => {
	try {
		const searchAgent = useragent.parse(agentCheck);

		loggerElastic(
			'flow-security',
			'200',
			'validation-agent',
			'checkAgent',
			JSON.stringify(agentCheck),
			JSON.stringify(searchAgent)
		);

		const searchUserBlock = process.env.USER_AGENTS_BLOCKED.split(',').some(
			(agent) => agentCheck.includes(agent)
		);

		return searchUserBlock;
	} catch (e) {
		loggerElastic(
			'flow-security',
			'499',
			'validation-agent',
			'checkAgent',
			JSON.stringify(agentCheck),
			JSON.stringify(e.message)
		);

		return true;
	}
};
