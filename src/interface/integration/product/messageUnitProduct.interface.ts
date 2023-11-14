import { IUnitProduct } from '../../erpProtheus/product/unitProduct.interface';
import { IOrderCheck } from '../order';

export interface IMessageValidateUnitProduct {
	message: IUnitProduct;
	valueOrderCheck: IOrderCheck;
}
