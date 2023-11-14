('use strict');

import { Service as MoleculerService, ServiceBroker } from 'moleculer';
import { Event, Service } from 'moleculer-decorators';
import { CreateJobController } from '../../../src/controller/integration/job/createJobSeniorGupy.controller';
import { ICreateJobSeniorGupy } from '../../../src/interface/senior/job/createJobSeniorGupy.interface';
import { apmElasticConnect, loggerElastic } from '../../library/elasticSearch';

@Service({
	name: 'senior.gupy.integration.createjob',
	group: 'flow-senior'
})
export default class CreateJobService extends MoleculerService {
	responseApi: any | Array<object>;
	roleIdParams: number;
	branchIdParams: number;
	checkRole: any | Array<object>;
	checkBranch: any | Array<object>;
	checkDepartament: any | Array<object>;
	resultRole: any | object;
	returnResponse: object;
	validListId: number;
	validBranchId: number;
	validDepartamentId: number;
	indexName = 'flow-senior';
	isCode = '200';
	originLayer = 'integration';
	serviceName = 'CreateJobService';

	public constructor(public broker: ServiceBroker) {
		super(broker);
	}

	@Event({
		name: 'senior.gupy.integration.post.createjob',
		group: 'flow-senior'
	})
	public async PostCreateJobSeniorGupy(
		gupySerniorCreate: ICreateJobSeniorGupy
	) {
		try {
			const controllerJobGupy = new CreateJobController();

			this.checkRole = await this.broker.emit('senior.gupy.jobroles', {
				method: 'get',
				body: '',
				params: { code: gupySerniorCreate.codeRole }
			});

			this.checkBranch = await this.broker.emit(
				'senior.gupy.jobbranchs',
				{
					method: 'get',
					body: '',
					params: { code: gupySerniorCreate.codeBranch }
				}
			);

			this.checkDepartament = await this.broker.emit(
				'senior.gupy.jobdepartaments',
				{
					method: 'get',
					body: '',
					params: { code: gupySerniorCreate.codeDepartament }
				}
			);

			const setListId = await this.checkRole.find(
				async (listRole: object) => {
					return listRole;
				}
			);

			const setBranchId = await this.checkBranch.find(
				async (listBranch: object) => {
					return listBranch;
				}
			);

			const setDepartamentId = await this.checkDepartament.find(
				async (listDepartament: object) => {
					return listDepartament;
				}
			);

			this.validListId = await controllerJobGupy.checkJsonValid(
				setListId
			);

			this.validBranchId = await controllerJobGupy.checkJsonValid(
				setBranchId
			);

			this.validDepartamentId = await controllerJobGupy.checkJsonValid(
				setDepartamentId
			);

			if (this.validListId === 0) {
				this.checkRole = await this.broker.emit(
					'senior.gupy.jobroles',
					{
						method: 'post',
						body: {
							name: gupySerniorCreate.name,
							code: gupySerniorCreate.codeRole,
							similarTo: gupySerniorCreate.similarRole
						},
						params: {}
					}
				);

				const setListId = await this.checkRole.find(
					async (listRole: object) => {
						return listRole;
					}
				);

				this.validListId = await controllerJobGupy.checkJsonValid(
					setListId
				);
			}

			if (this.validBranchId === 0) {
				this.checkBranch = await this.broker.emit(
					'senior.gupy.jobbranchs',
					{
						method: 'post',
						body: {
							name: gupySerniorCreate.branchName,
							code: gupySerniorCreate.codeBranch,
							path: [gupySerniorCreate.departmentName],
							addressCountry:
								gupySerniorCreate.addressCountry !== undefined
									? gupySerniorCreate.addressCountry
									: '',
							addressCountryShortName:
								gupySerniorCreate.addressCountryShortName !==
								undefined
									? gupySerniorCreate.addressCountryShortName
									: '',
							addressState:
								gupySerniorCreate.addressState !== undefined
									? gupySerniorCreate.addressState
									: '',
							addressStateShortName:
								gupySerniorCreate.addressStateShortName !==
								undefined
									? gupySerniorCreate.addressStateShortName
									: '',
							addressCity:
								gupySerniorCreate.addressCity !== undefined
									? gupySerniorCreate.addressCity
									: '',
							addressStreet:
								gupySerniorCreate.addressStreet !== undefined
									? gupySerniorCreate.addressStreet
									: '',
							addressNumber:
								gupySerniorCreate.addressNumber !== undefined
									? gupySerniorCreate.addressNumber
									: '',
							addressZipCode:
								gupySerniorCreate.addressZipCode !== undefined
									? gupySerniorCreate.addressZipCode
									: ''
						},
						params: {}
					}
				);

				const setBranchId = await this.checkBranch.find(
					async (listBranch: object) => {
						return listBranch;
					}
				);

				this.validBranchId = await controllerJobGupy.checkJsonValid(
					setBranchId
				);
			}

			if (this.validDepartamentId === 0) {
				this.checkDepartament = await this.broker.emit(
					'senior.gupy.jobdepartaments',
					{
						method: 'post',
						body: {
							name: gupySerniorCreate.name,
							code: gupySerniorCreate.codeDepartament,
							similarTo: gupySerniorCreate.similardepartment
						},
						params: {}
					}
				);

				const setDepartamentId = await this.checkDepartament.find(
					async (listDepartament: object) => {
						return listDepartament;
					}
				);

				this.validDepartamentId =
					await controllerJobGupy.checkJsonValid(setDepartamentId);
			}

			const jsonGupyCreateJob: ICreateJobSeniorGupy = {
				customFields: gupySerniorCreate.customFields,
				name: gupySerniorCreate.name,
				type: gupySerniorCreate.type,
				code: gupySerniorCreate.code,
				roleId: this.validListId,
				branchId: this.validBranchId,
				departmentId: this.validDepartamentId,
				numVacancies: gupySerniorCreate.numVacancies,
				publicationType: gupySerniorCreate.publicationType,
				description: gupySerniorCreate.description,
				responsibilities: gupySerniorCreate.responsibilities,
				prerequisites: gupySerniorCreate.prerequisites,
				reason: gupySerniorCreate.reason,
				salary: {
					currency: gupySerniorCreate.salary.currency,
					startsAt: gupySerniorCreate.salary.startsAt
				}
			};

			this.responseApi = await this.broker.emit(
				'senior.gupy.post.createjob',
				jsonGupyCreateJob
			);

			loggerElastic(
				this.indexName,
				this.isCode,
				this.originLayer,
				this.serviceName,
				JSON.stringify(gupySerniorCreate),
				JSON.stringify(this.responseApi)
			);

			this.responseApi.forEach((respRoute: object) => {
				this.returnResponse = respRoute;
			});

			loggerElastic(
				this.indexName,
				this.isCode,
				this.originLayer,
				this.serviceName,
				JSON.stringify(gupySerniorCreate),
				JSON.stringify(this.returnResponse)
			);

			return this.returnResponse;
		} catch (error) {
			loggerElastic(
				this.indexName,
				'499',
				this.originLayer,
				this.serviceName,
				JSON.stringify(gupySerniorCreate),
				JSON.stringify(error.message)
			);

			apmElasticConnect
				.setTransactionName(this.indexName)
				.captureError(new Error(error.message))
				.endTransaction([error]);
		}
	}
}
