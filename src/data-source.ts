import 'reflect-metadata';
import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';

dotenv.config();

export const connectionCrmIso = new DataSource({
	type: 'mssql',
	database: process.env.DB_CRMISO,
	username: process.env.USER_CRMISO,
	password: process.env.PASS_CRMISO,
	host: process.env.HOST_CRMISO,
	logging: false,
	synchronize: false,
	options: {
		enableArithAbort: true,
		encrypt: false
	},
	requestTimeout: 120000,
	connectionTimeout: 120000,
	entities: [__dirname + '/entity/**/*{.js,.ts}'],
	migrations: [],
	subscribers: []
});

export const connectionIntegrador = new DataSource({
	type: 'mssql',
	name: 'default',
	database: process.env.DB_INTEGRADOR,
	username: process.env.USER_INTEGRADOR,
	password: process.env.PASS_INTEGRADOR,
	host: process.env.HOST_INTEGRADOR,
	logging: false,
	synchronize: false,
	options: {
		enableArithAbort: true,
		encrypt: false
	},
	requestTimeout: 120000,
	connectionTimeout: 120000,
	entities: [__dirname + '/entity/**/*{.js,.ts}'],
	migrations: [],
	subscribers: []
});

export const flow = new DataSource({
	type: 'mssql',
	name: 'default',
	database: process.env.DB_INTEGRADOR,
	username: process.env.USER_INTEGRADOR,
	password: process.env.PASS_INTEGRADOR,
	host: process.env.HOST_INTEGRADOR,
	logging: false,
	synchronize: true,
	options: {
		enableArithAbort: true,
		encrypt: false
	},
	requestTimeout: 120000,
	connectionTimeout: 120000,
	entities: [__dirname + '/entity/**/*{.js,.ts}'],
	migrations: [],
	subscribers: []
});
