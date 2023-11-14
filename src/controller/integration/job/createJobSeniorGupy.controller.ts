import {
	IICreateJobSeniorGupy,
	IVCreateJobSeniorGupy
} from '../../../interface/senior/job/createJobSeniorGupy.interface';

export class CreateJobController {
	retJson: number;

	public async checkJsonValid(gupySerniorCreate: IICreateJobSeniorGupy) {
		if (gupySerniorCreate.totalResults === 0) {
			this.retJson = 0;
		} else if (gupySerniorCreate.status === 409) {
			this.retJson =
				gupySerniorCreate.data.branchId ||
				gupySerniorCreate.data.departmentId ||
				gupySerniorCreate.data.roleId;
		} else if (Array.isArray(gupySerniorCreate.results)) {
			gupySerniorCreate.results.forEach((resJson: { id: number }) => {
				this.retJson = resJson.id;
			});
		} else {
			this.retJson = gupySerniorCreate.id;
		}

		return this.retJson;
	}
}
