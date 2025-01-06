<template>
    <div class="store_content">
        <Notivue v-slot="item">
            <Notification :item="item" />
        </Notivue>
        
        <ImageSlider />
        <div class="store_wrapper">
            <ContentView>
                <template #title>
                    매장 관리
                </template>

                <template #controlArea>
                    <ButtonRectangle @click="goCreateStore">매장 추가</ButtonRectangle>
                </template>

                <template #table>
                    <Table :col-def="tableHeader" :row-data="rowData" :button-function="useButton" @refresh="getStoreList"></Table>
                </template>
            </ContentView>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, type Ref } from 'vue';
import { type AxiosResponse } from 'axios';

import { Notivue, Notification, push } from 'notivue';

import ImageSlider from '@/views/stores/ImageSlider.vue';
import ContentView from '@/components/contents/ContentView.vue';
import ButtonRectangle from '@/components/buttons/ButtonRectangle.vue';

import Table from '@/components/tables/TableView.vue';
import ButtonInTable from '@/components/buttons/ButtonInTable.vue';
import type { ColDef, RowData} from '@/types/TableTypes';
import {useButton} from '@/views/stores/StoreTableButton';

import router from '@/router';

import StoreApi from '@/apis/StoreApi';
import { markRaw } from 'vue';
const getStoreList = ()=>{
    StoreApi.getStoreList()
    .then(res=>{
        if(res.length === 0){
            rowData.value = res;
        }
        else {
            const extendRow = {
                edit: {component: ButtonInTable, slot: '수정'},
                delete: {component: ButtonInTable, slot: '삭제'},
            }
            const result = res.map((e: AxiosResponse)=>{
                return Object.assign(e, extendRow);
            });
    
            rowData.value = markRaw(result);
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

const tableHeader: ColDef[] = [
    { header: '번호', value: 'number', ratio: 1 },
    { header: '매장명', value: 'store_name', ratio: 5 },
    { header: '매장 전화번호', value: 'store_tel_number', ratio: 5 },
    { header: '주소', value: 'store_address', ratio: 5 },
    { header: '사장님 성함', value: 'store_owner', ratio: 5 },
    { header: '테이블 개수', value: 'table_count', ratio: 5 },
    { header: '수정', value: 'edit', ratio: 2, extend: true },
    { header: '삭제', value: 'delete', ratio: 2, extend: true },
];
const rowData: Ref<RowData<typeof ButtonInTable>[]> = ref([]);



const goCreateStore = ()=>{
    router.push('/store/form');
}
</script>

<style scoped>
.image_slider {
    margin: -50px;
    margin-bottom: 0;
}
.store_wrapper {
    margin-top: 40px;
    padding-bottom: 50px;
}
</style>