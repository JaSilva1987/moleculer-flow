import { ICustomerData } from '../../erpProtheus/customer';
import { IOrderCheck } from '../order';

export interface IMessageValidateConsumer {
	message: ICustomerData;
	valueOrderCheck: IOrderCheck;
}
