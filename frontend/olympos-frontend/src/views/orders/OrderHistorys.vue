<template>
    <div class="order_history_content">
        <Notivue v-slot="item">
            <Notification :item="item" />
        </Notivue>
        
        <div class="order_history_wrapper">
            <ContentView>
                <template #title>
                    주문 내역
                </template>

                <template #controlArea>
                    <SelectWithTitle>
                        <template #name>매장</template>
                        <template #select>
                            <SelectDefault v-model="activeStoreId" :option-list="storeList" @handleChange="getOrderHistoryList"/>
                        </template>
                    </SelectWithTitle>
                </template>

                <template #table>
                    <Table :col-def="tableHeader" :row-data="rowData"></Table>
                </template>
            </ContentView>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, type Ref, inject } from 'vue';

import { Notivue, Notification, push } from 'notivue';
import ContentView from '@/components/contents/ContentView.vue';
import Table from '@/components/tables/TableView.vue';
import type { ColDef, RowData} from '@/types/TableTypes';
import type { GetStoreListResponse } from '@/types/StoreTypes';
import type { Order } from '@/types/OrderTypes';
import SelectWithTitle from '@/components/selects/SelectWithTitle.vue';
import SelectDefault, { type SelectOptionList } from '@/components/selects/SelectDefault.vue';

import StoreApi from '@/apis/StoreApi';
import OrderHistoryApi from '@/apis/OrderHistoryApi';



const tableHeader: ColDef[] = [
    { header: '번호', value: 'number', ratio: 1 },
    { header: '주문 일시', value: 'order_date', ratio: 5 },
    { header: '상품', value: 'unique_product', ratio: 5 },
    { header: '수량', value: 'amount', ratio: 5 },
    { header: '주문 상태', value: 'order_state', ratio: 5 },
];
const rowData: Ref<RowData<null>[]> = ref([]);



const activeStoreId = ref<number | null>(null);
const storeList: Ref<SelectOptionList[]> = ref([]);
const getStoreList = ()=>{
    StoreApi.getStoreList()
    .then((res: GetStoreListResponse[])=>{
        storeList.value = res.map(e=>{
            return {
                id: e.unique_store_info,
                name: e.store_name
            }
        });
        if(storeList.value.length > 0){
            activeStoreId.value = storeList.value[0].id;
            getOrderHistoryList();
        }
    })
    .catch(err=>{
        push.error({
            title: '에러',
            message: err.message || 'server error',
        });
    });
}
getStoreList();



import { momentPlunginKey } from '@/symbols/InjectionKeys';
const momentPlungin = inject(momentPlunginKey);
if(momentPlungin === undefined){
    throw new Error("Failed to inject");
}
const getOrderHistoryList = ()=>{
    const params = {
        store_uid: activeStoreId.value as number
    }
    OrderHistoryApi.getOrderList(params)
    .then((res)=>{
        rowData.value = res.map((e: Order)=>{
            e.order_date = momentPlungin.format(e.order_date);
            return e;
        });
    })
    .catch(err=>{
        push.error({
            title: '에러',
            message: err.message || 'server error',
        });
    });
}
</script>

<style scoped>
</style>