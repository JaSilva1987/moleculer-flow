import { IOrderRequestEcommerceIntegration } from '../../integration/order/orderRequestEcommerce.interface';
import { ICustomer } from '../customer/customer.interface';
import { IGiftList } from '../gift/giftList.interface';
import { IPayment } from '../payment/payment.interface';
import { IPriceList } from '../price/priceList.interface';
import { IReceiverAddress } from '../receiver/receiverAddress.interface';
import { IShipping } from '../shipping/shipping.interface';
import { IExternalMarketPlaceOrders } from './externalMarketPlaceOrders.interface';
import { IOrderDelivery } from './orderDelivery.interface';
import { IOrderItem } from './orderItem.interface';
import { IOrderTracking } from './orderTracking.interface';

export interface IOrderRequest {
	id?: string;
	sourceId?: string;
	sourceDescription?: string;
	integrationId?: string;
	orderGroupId?: string;
	customer?: ICustomer;
	orderDate?: string;
	expirationDate?: string;
	discountValue?: number;
	shippingValue?: number;
	additionValue?: number;
	totalValue?: number;
	totalWeight?: number;
	shipping?: IShipping;
	estimatedDispatchTime?: number;
	estimatedDeliveryTime?: number;
	status?: 1 | 2 | 3 | 6 | 8 | 9 | 10;
	statusDescription?: string;
	payment?: IPayment;
	installmentQuantity?: number;
	customerComment?: number;
	orderNote?: string;
	items?: IOrderItem[];
	priceList?: IPriceList;
	receiverAddress?: IReceiverAddress;
	orderTrackings?: IOrderTracking[];
	tags?: string[];
	externalMarketplaceOrders?: IExternalMarketPlaceOrders[];
	externalMarketplaceComission?: number;
	orderDelivery?: IOrderDelivery;
	orderExportedToErp?: boolean;
	totalHeight?: number;
	totalWidth?: number;
	totalLength?: number;
	totalCubage?: number;
	giftList?: IGiftList;
	updateAt?: string;
	reviewUrl?: string;
}

export interface ISendOrderRequest {
	orderRequest: IOrderRequest;
	orderData: IOrderRequestEcommerceIntegration;
}

export interface IConfirmOrderSuccess {
	orderId: string;
	orderConfirm: any;
}
