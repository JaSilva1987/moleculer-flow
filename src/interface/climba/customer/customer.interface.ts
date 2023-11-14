import { IShippingAddress } from '../shipping/shippingAddress.interface';
import { ICustomerDocument } from './customerDocument.interface';
import { ICustomerPhone } from './customerPhone.interface';

export interface ICustomer {
	id?: string;
	marketplaceId?: string;
	name?: string;
	tradeName?: string;
	contactName?: string;
	gender?: 'f' | 'm' | undefined;
	birthDate?: string;
	documents?: ICustomerDocument[];
	phones?: ICustomerPhone[];
	email?: string;
	shippingAddress?: IShippingAddress;
	priceListId?: string;
}
