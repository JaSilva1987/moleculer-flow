import { IAttribute } from '../attribute/attribute.interface';
import { IProductVariantPrice } from './productVariantPrice.interface';

export interface IProductVariants {
	sku: string;
	manufacturerCode?: string;
	attributes?: IAttribute[];
	quantity?: number;
	typeSalesUnit?: string;
	description?: string;
	grossWeight?: number;
	netWeight?: number;
	height?: number;
	width?: number;
	length?: number;
	barCode?: string;
	productOrigin?: string;
	ipi?: number;
	prices?: IProductVariantPrice[];
}
