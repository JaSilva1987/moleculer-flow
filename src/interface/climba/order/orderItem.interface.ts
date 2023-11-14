import { IOrderVariants } from './orderVariants.interface';

export interface IOrderItem {
	id?: number;
	name?: string;
	orderItemVariants?: IOrderVariants[];
	sequence?: number;
	productId?: string;
	sku?: string;
	quantity: number;
	sellingPrice?: number;
	giftPaperEnabled?: boolean;
	giftPaperValue?: number;
	giftPaperMessage?: string;
	discountValue?: number;
	price?: number;
	length?: number;
	width?: number;
	freebie?: boolean;
	freebieMessage?: string;
	typeSalesUnit?: string;
	externalMarketplaceComission?: number;
	purchaseByFootage?: boolean;
	manufacturerCode?: string;
}
