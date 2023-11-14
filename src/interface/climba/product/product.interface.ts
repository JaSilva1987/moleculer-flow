import { IEcommerceProductIntegration } from '../../integration/product/EcommerceProduct.interface';
import { IProductVariants } from './productVariant.interface';
import { IProductVideo } from './productVideo.interface';

export interface IProduct {
	id?: string;
	status?: 0 | 1 | 2;
	statusDescription?: string;
	categories?: string[];
	brandId?: string;
	name?: string;
	description?: string;
	productVariants?: IProductVariants[];
	videos?: IProductVideo[];
	shortDescription?: string;
}

export interface IProductStock {
	quantity: number;
}

export interface ISendProductStock {
	updateStock: IProductStock;
	id: string;
}

export interface ISendProduct {
	product: IProduct;
	dataProduct: IEcommerceProductIntegration;
}
