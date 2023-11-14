'use strict';

import * as dotenv from 'dotenv';
import {
	Errors,
	Service as MoleculerService,
	ServiceBroker,
	ServiceSchema
} from 'moleculer';
import { Action, Service, Event } from 'moleculer-decorators';
import { alcisRequestController } from '../../../src/controller/alcis/services/alcisRequest.controller';
import {
	IIReservationConfirmation,
	IReservationConfirmation
} from '../../../src/interface/alcis/reservationConfirmation/reservationConfirmation.interface';
import { apmElasticConnect, loggerElastic } from '../../library/elasticSearch';
import { ReservationConfirmationRepository } from '../../../src/repository/integration/reservation/reservationConfirmation.repository';
import { CronJob } from 'cron';
import { setTransaction } from '../../../src/controller/alcis/services/alcisReservation.controller';
import { setTimeout } from 'timers/promises';

dotenv.config();
@Service({
	name: 'alcis-reservation-confirmation',
	group: 'flow-alcis'
})
export default class reservationConfirmationData extends MoleculerService {
	public cronJobOne: CronJob;
	public indexName = 'alcis-reservation-confirmation';
	public serviceName = 'reservation-confirmation';
	public originLayer = 'alcis';

	public constructor(public broker: ServiceBroker, schema: ServiceSchema) {
		super(broker);

		this.cronJobOne = new CronJob(
			process.env.ALCIS_PROTHEUS_RESERVATION,
			async () => {
				try {
					this.broker.broadcast('ProcessProtheusReservation', 'true');
				} catch {
					new Error('Cron not run');
				}
			}
		);

		this.iniciarCronJob();
	}

	private reservationConfirmationUrl =
		process.env.ALCIS_BASE_URL +
		process.env.ALCIS_RESERVATION_CONFIRMATION_URL;

	private async iniciarCronJob() {
		if (!this.cronJobOne.running) {
			this.cronJobOne.start();

			await setTimeout(5000);
			if (this.cronJobOne.running) {
				this.cronJobOne.stop();
			}
		}
	}

	@Action({
		cache: false,
		rest: 'GET reservation-confirmation/',
		name: 'service.alcis.get-reservation-confirmation',
		group: 'flow-alcis'
	})
	public async getReservationConfirmation(context: any) {
		apmElasticConnect.startTransaction(
			'IA Version 1 => ALCIS - GET Reservation Confirmation',
			'request'
		);
		let getReservationConfirmationParams = context.params;

		loggerElastic(
			this.indexName,
			'200',
			this.originLayer,
			this.serviceName,
			JSON.stringify(`get - ${this.reservationConfirmationUrl}`),
			JSON.stringify(getReservationConfirmationParams)
		);

		try {
			const getReservationConfirmationResponse =
				await alcisRequestController(
					this.reservationConfirmationUrl,
					null,
					'Authorization',
					'get',
					null,
					null,
					null,
					null,
					getReservationConfirmationParams
				);

			if (getReservationConfirmationResponse instanceof Error) {
				throw getReservationConfirmationResponse;
			}

			context.meta.$statusCode =
				getReservationConfirmationResponse.status;

			loggerElastic(
				this.indexName,
				String(getReservationConfirmationResponse.status),
				this.originLayer,
				this.serviceName,
				JSON.stringify(`get - ${this.reservationConfirmationUrl}`),
				JSON.stringify(getReservationConfirmationResponse || '')
			);

			apmElasticConnect.endTransaction([this.reservationConfirmationUrl]);

			return getReservationConfirmationResponse.message;
		} catch (error) {
			const errorStatus = error?.status || error?.code || 400;

			loggerElastic(
				this.indexName,
				String(errorStatus),
				this.originLayer,
				this.serviceName,
				JSON.stringify(`get - ${this.reservationConfirmationUrl}`),
				JSON.stringify(error)
			);

			context.meta.$statusCode = +errorStatus;

			apmElasticConnect.endTransaction([this.reservationConfirmationUrl]);
			return error;
		}
	}

	@Action({
		cache: false,
		rest: 'PUT reservation-confirmation/',
		name: 'service.alcis.put-reservation-confirmation',
		group: 'flow-alcis'
	})
	public async putReservationConfirmation(context: any) {
		apmElasticConnect.startTransaction(
			'IA Version 1 => Protheus - PUT Reservation Confirmation',
			'request'
		);

		const putBody: IReservationConfirmation = context.params;

		loggerElastic(
			this.indexName,
			'200',
			this.originLayer,
			'IA Version 1 => Protheus - PUT Reservation Confirmation',
			JSON.stringify('Recebido do Alcis PUT: ' + putBody),
			''
		);

		try {
			const creatOrder: IIReservationConfirmation =
				await ReservationConfirmationRepository.PostOrders(putBody);

			apmElasticConnect.endTransaction([this.serviceName]);

			loggerElastic(
				this.indexName,
				String(creatOrder.status),
				this.originLayer,
				'IA Version 1 => Protheus - PUT Reservation Confirmation',
				JSON.stringify('Resultado Gravação da Reserva'),
				JSON.stringify(creatOrder.message)
			);

			if (creatOrder.status == 200) {
				return Promise.resolve(creatOrder);
			} else {
				return Promise.reject(
					new Errors.MoleculerError(creatOrder.message, 424)
				);
			}
		} catch (error) {
			loggerElastic(
				this.indexName,
				'499',
				this.originLayer,
				this.serviceName,
				JSON.stringify(
					'Erro Processo Recebido do Alcis PUT: ' + putBody
				),
				JSON.stringify(error)
			);

			apmElasticConnect.endTransaction([this.serviceName]);

			return Promise.reject(
				new Errors.MoleculerError(error.message, 424)
			);
		}
	}

	@Event({
		name: 'ProcessProtheusReservation',
		group: 'cronJobs-flow'
	})
	public async CallGenerate(ctx: any) {
		try {
			loggerElastic(
				this.indexName,
				'200',
				this.originLayer,
				'IA Version 1 => CronJob => Protheus - PUT Reservation Confirmation',
				JSON.stringify('CronJob Iniciado'),
				JSON.stringify(ctx)
			);

			await setTransaction(
				Boolean(process.env.ALCIS_PROTHEUS_RESERVATION_ACTIVE)
			);
		} catch (error) {
			loggerElastic(
				this.indexName,
				'499',
				this.originLayer,
				'IA Version 1 => CronJob => Protheus - PUT Reservation Confirmation',
				JSON.stringify('CronJob Erro'),
				JSON.stringify(error)
			);
		}
	}
}
