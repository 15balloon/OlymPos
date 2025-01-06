<template>
    <div class="menu_content">
        <Notivue v-slot="item">
            <Notification :item="item" />
        </Notivue>

        <ImageSlider />

        <div class="order_history_wrapper">
            <ContentViewWithTab>
                <template #title>
                    메뉴 관리
                </template>

                <template #controlArea>
                    <SelectWithTitle>
                        <template #name>매장</template>
                        <template #select>
                            <SelectDefault v-model="activeStoreId" :option-list="storeList" @handleChange="getProductList"/>
                        </template>
                    </SelectWithTitle>

                    <ButtonRectangle @click="goMenuGroup">메뉴 그룹 관리</ButtonRectangle>
                    <ButtonRectangle>메뉴 추가</ButtonRectangle>
                    <ButtonRectangle>옵션 관리</ButtonRectangle>
                </template>

                <template #tab>
                    <div>
                        <TabDefault :tabList="tabList" @getMenu="getProductList"></TabDefault>
                    </div>
                </template>

                <template #table>
                    <Table :col-def="tableHeader" :row-data="rowData"></Table>
                </template>
            </ContentViewWithTab>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, markRaw, onBeforeMount } from 'vue';

import { Notivue, Notification, push } from 'notivue';

import ImageSlider from '@/views/stores/ImageSlider.vue';
import ContentViewWithTab from '@/components/contents/ContentViewWithTab.vue';
import SelectWithTitle from '@/components/selects/SelectWithTitle.vue';
import SelectDefault, { type SelectOptionList } from '@/components/selects/SelectDefault.vue';
import ButtonRectangle from '@/components/buttons/ButtonRectangle.vue';

import Table from '@/components/tables/TableView.vue';
import ButtonInTable from '@/components/buttons/ButtonInTable.vue';
import TabDefault from '@/components/tab/TabDefault.vue';
import type { ColDef, RowData} from '@/types/TableTypes';
import type { GetStoreListResponse } from '@/types/StoreTypes';

import StoreApi from '@/apis/StoreApi';
import MenuApi from '@/apis/MenuApi';
import { type GetProductGroupListResponse, type ProductList, type ResponseMenus } from '@/types/MenuTypes';
import router from '@/router';



const tableHeader: ColDef[] = [
    { header: '번호', value: 'number', ratio: 1 },
    { header: '메뉴명', value: 'product_name', ratio: 5 },
    { header: '가격', value: 'price', ratio: 3 },
    { header: '설명', value: 'description', ratio: 7 },
    { header: '수량', value: 'amount', ratio: 2 },
    { header: '옵션 여부', value: 'options', ratio: 2 },
    { header: '이미지 여부', value: 'image', ratio: 2 },
    { header: '상세 정보', value: 'detail', ratio: 2, extend: true },
    { header: '삭제', value: 'delete', ratio: 2, extend: true },
];
const rowData = ref<RowData<typeof ButtonInTable>[]>([]);


onBeforeMount(()=>{
    getStoreList();
});
const activeStoreId = ref<number>();
const storeList = ref<SelectOptionList[]>([]);
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
            getProductGroupList()
            .then(()=>{
                getProductList();
            });
        }
    })
    .catch(err=>{
        push.error({
            title: '에러',
            message: err.message || 'server error',
        });
    });
}




const tabList = ref<GetProductGroupListResponse>([]);
const tabModel = ref<number>(0);
const getProductGroupList = async ()=>{
    const params = {
        store_uid: activeStoreId.value as number
    }
    await MenuApi.getProductGroupList(params)
    .then((res)=>{
        tabList.value = res;
    })
    .catch(err=>{
        push.error({
            title: '에러',
            message: err.message || 'server error',
        });
    });
}



const getProductList = ()=>{
    const params = {
        group_uid: tabList.value[tabModel.value].unique_product_group
    }
    MenuApi.getProductList(params)
    .then((res)=>{
        if(res.length > 0){
            const extendRow = {
                detail: {component: ButtonInTable, slot: '상세 정보'},
                delete: {component: ButtonInTable, slot: '삭제'},
            }
            const result = res.map((e: ProductList)=>{
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


const goMenuGroup = ()=>{
    router.push('/menu/group');
}
</script>

<style scoped>
.image_slider {
    margin: -50px;
    margin-bottom: 0;
    height: 200px;
}
.order_history_wrapper {
    margin-top: 40px;
    padding-bottom: 50px;
}
</style>