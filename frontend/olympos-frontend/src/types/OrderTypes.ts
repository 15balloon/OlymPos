import type { RowData } from "./TableTypes";

export interface GetOrderListParams {
    store_uid: number;
}
export interface Order extends RowData<null> {
    amount: number;
    last_modify_date: string;
    order_date: string;
    order_state: number;
    table_number: number;
    unique_order: number;
    unique_product: number;
    unique_store_info: number;
}
export type GetOrderListResponse = Order[];