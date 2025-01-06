export interface CreateStoreRequest {
    store_uid?: number;
    name: string;
    owner: string;
    address: string;
    tel_num: string;
    count: number;
}

export interface StoreIdRequest {
    store_uid: number;
}

export interface StoreInfo {
    storeId: number;
    storeName: String;
}

export interface Store {
    disable_date: null | string,
    last_modify_date: string,
    store_address: string,
    store_name: string,
    store_owner: string,
    store_tel_number: string,
    table_count: number,
    unique_admin: number,
    unique_store_info: number
}
export type GetStoreListResponse = Store[];