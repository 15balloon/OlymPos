import type { RowData } from "./TableTypes";

export interface ResponseMenus {
    unique_product: number;
	unique_store_info: number;
	unique_product_group: number;
	product_name: string;
	price: number;
	image: string;
	description: string;
	amount: number;
	options: number[];
}

export interface GetProductGroupListParams {
	store_uid: number;
}
export interface ProductGroup {
	disable_date: string;
	group_name: string;
	unique_product_group: number;
	unique_store_info: number;
}
export type GetProductGroupListResponse = ProductGroup[];

export interface GetProductListParams {
	group_uid: number;
}
export interface ProductList {
	amount: number;
	description: string;
	disable_date: string;
	image: string;
	options: number[];
	price: number;
	product_name: string;
	unique_product: number;
	unique_product_group: number;
	unique_store_info: number;
}
export type GetProductListResponse = ProductList[];