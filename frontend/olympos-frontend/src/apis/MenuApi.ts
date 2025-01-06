import DefaultAxios from '@/apis/DefaultApi';
import { ACCESS_TOKEN } from '@/functions/AccessToken';
import { push } from 'notivue';
import { API_CODE } from '@/constants/ApiCodeConstant';
import type { GetProductGroupListParams, GetProductGroupListResponse, GetProductListParams, GetProductListResponse } from '@/types/MenuTypes';

const MenuApi = {
    async getProductGroupList(params: GetProductGroupListParams): Promise<GetProductGroupListResponse> {
        return await DefaultAxios.get('/get-group-list', {
            params,
            headers: {
                Authorization: ACCESS_TOKEN()
            }
        })
        .then(res=>{
            if(res.data.code === 100 && res.data.result === "Success"){
                return res.data.groups;
            }
            else {
                throw new Error(res.data.code);
            }
        })
        .catch(error=>{
            throw new Error(API_CODE[error.message]);
        })
    },
    async getProductList(params: GetProductListParams): Promise<GetProductListResponse>{
        return await DefaultAxios.get('/get-product-list', {
            params,
            headers: {
                Authorization: ACCESS_TOKEN()
            }
        })
        .then(res=>{
            if(res.data.code === 100 && res.data.result === "Success"){
                return res.data.products;
            }
            else {
                throw new Error(res.data.code);
            }
        })
        .catch(error=>{
            throw new Error(API_CODE[error.message]);
        });
    }
}
export default MenuApi;