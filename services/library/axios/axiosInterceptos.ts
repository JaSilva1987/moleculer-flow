import axios, { AxiosError, AxiosResponse } from 'axios';
import { createChaosInterceptor } from 'axios-chaos-interceptor';
import { IAxiosInterceptor } from '../../../src/interface/library/axios/axiosInterceptor.interface';

export async function axiosInterceptors(axObj: IAxiosInterceptor) {
	try {
		const apiClient = axios.create(axObj.objtRequest);
		const chaosInterceptor: any = createChaosInterceptor(setConfig);

		apiClient.interceptors.response.use(chaosInterceptor);

		const response = await apiClient(axObj.objtRequest);
		const axiosResponse = response as AxiosResponse;
		return await axiosResponse?.data;
	} catch (err) {
		if (err && err.response) {
			const axiosError = err as AxiosError;
			return await axiosError.response?.data;
		}

		throw await err;
	}
}

const setConfig = [
	{
		status: 504,
		message: 'Gateway Timeout',
		delay: 180000,
		rate: 0,
		retries: 5,
		meta: {
			statusHttp: 504,
			message: 'Gateway Timeout'
		}
	}
];
