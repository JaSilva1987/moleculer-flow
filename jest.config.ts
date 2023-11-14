import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
	collectCoverageFrom: ['services/**/*.ts', '!services/api.service.ts'],
	collectCoverage: true,
	coverageDirectory: '<rootDir>/coverage',
	coveragePathIgnorePatterns: ['/index.ts$'],
	coverageThreshold: {
		global: {
			branches: 30,
			functions: 30,
			lines: 30,
			statements: 30
		}
	},
	detectOpenHandles: false,
	moduleFileExtensions: ['ts', 'tsx', 'js', 'json', 'xml'],
	testEnvironment: 'node',
	testMatch: ['**/*.spec.(ts|js)'],
	transform: {
		'^.+\\.(ts|tsx)$': ['ts-jest', { tsconfig: 'tsconfig.json' }]
	}
};

export default config;
