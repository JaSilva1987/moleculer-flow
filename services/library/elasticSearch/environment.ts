import ip from 'ip';

export const environmentElastic: () => string = () => {
	let environmentIp: string;

	switch (ip.address()) {
		case process.env.ENVIRONMENT_IP_PRODUCTION:
			environmentIp = process.env.ENVIRONMENT_PRODUCTION;
			break;
		case process.env.ENVIRONMENT_IP_HOMOLOGATION:
			environmentIp = process.env.ENVIRONMENT_HOMOLOGATION;
			break;
		default:
			environmentIp = process.env.ENVIRONMENT_DEVELOPMENT;
			break;
	}

	return environmentIp;
};
