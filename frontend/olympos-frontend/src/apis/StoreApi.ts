import DefaultAxios from '@/apis/DefaultApi';
import { type CreateStoreRequest, type GetStoreListResponse, type Store, type StoreIdRequest } from '@/types/StoreTypes';
import { ACCESS_TOKEN } from '@/functions/AccessToken';
import { push } from 'notivue';
import { API_CODE } from '@/constants/ApiCodeConstant';

const StoreApi = {
    async getStoreList(): Promise<GetStoreListResponse>{
        return await DefaultAxios.get('/get-my-stores', {
            headers: {
                Authorization: ACCESS_TOKEN()
            }
        })
        .then(res=>{
            if(res.data.code === 100 && res.data.result === "Success"){
                return res.data.stores;
            }
            else {
                throw new Error(res.data.code);
            }
        })
        .catch(error=>{
            throw new Error(API_CODE[error.message]);
        })
    },
    async createStore(params: CreateStoreRequest): Promise<void>{
        return await DefaultAxios.post('/add-store', params, {
            headers: {
                Authorization: ACCESS_TOKEN()
            }
        })
        .then(res=>{
            if(res.data.code === 100 && res.data.result === "Success"){
                return;
            }
            else {
                throw new Error(res.data.code);
            }
        })
        .catch(error=>{
            throw new Error(API_CODE[error.message]);
        })
    },
    async getStoreInfo(params: StoreIdRequest): Promise<Store>{
        return await DefaultAxios.get('/get-store-info', {
            params: params,
            headers: {
                Authorization: ACCESS_TOKEN()
            }
        })
        .then(res=>{
            if(res.data.code === 100 && res.data.result === "Success"){
                return res.data.store;
            }
            else {
                throw new Error(res.data.code);
            }
        })
        .catch(error=>{
            throw new Error(API_CODE[error.message]);
        })
    },
    async editStoreInfo(params: CreateStoreRequest): Promise<void> {
        return await DefaultAxios.post('/change-store-info', params, {
            headers: {
                Authorization: ACCESS_TOKEN()
            }
        })
        .then(res=>{
            if(res.data.code === 100 && res.data.result === "Success"){
                return;
            }
            else {
                throw new Error(res.data.code);
            }
        })
        .catch(error=>{
            throw new Error(API_CODE[error.message]);
        })
    },
    async deleteStoreInfo(params: StoreIdRequest): Promise<void>{
        return await DefaultAxios.post('/delete-store', params, {
            headers: {
                Authorization: ACCESS_TOKEN()
            }
        })
        .then(res=>{
            if(res.data.code === 100 && res.data.result === "Success"){
                return true;
            }
            else {
                throw new Error(res.data.code);
            }
        })
        .catch(error=>{
            throw new Error(API_CODE[error.message]);
        })
    }
}
export default StoreApi;