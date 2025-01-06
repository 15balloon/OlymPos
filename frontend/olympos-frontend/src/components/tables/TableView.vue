<template>
    <div>
        <template v-if="tableViewStore.displayOnCustomAlert">
            <Notivue v-slot="item">
                <CustomAlertWithTwoButtons :item="item as NotivueItem<CustomAlertWithTwoButtonsProps>" />
            </Notivue>
        </template>

        <template v-else>
            <Notivue v-slot="item">
                <Notification :item="item" />
            </Notivue>
        </template>

        <table>
            <thead>
                <tr id="theadRow">
                    <th v-for="(item, index) in colDef" :key="index" :style="{width: item.ratio*10+'px'}">{{ item.header }}</th>
                </tr>
            </thead>
            <tbody id="tbody">
                <template v-if="rowData">
                    <tr v-for="(item, index) in rowData" :key="index">
                        <td v-for="header in colDef" :key="header.value">
                            <template v-if="header.value === 'number'">
                                {{ index + 1 }}
                            </template>
    
                            <component v-else-if="header.extend === true" :is="item[header.value].component" @click="buttonFunction?.(item[header.value].slot, item, emit)">
                                <slot>{{item[header.value].slot}}</slot>
                            </component>
                            
                            <template v-else>
                                {{ item[header.value] }}
                            </template>
                        </td>
                    </tr>
                </template>
                <template v-else>
                    <div class="empty-table">
                        조회된 데이터가 없습니다.
                    </div>
                        
                </template>
            </tbody>
        </table>
    </div>
</template>

<script setup lang="ts">
import { ref, onUnmounted } from 'vue';
import StoreApi from '@/apis/StoreApi';
import router from '@/router';
import { Notivue, Notification, push } from 'notivue';
import type { NotivueItem } from 'notivue';
import CustomAlertWithTwoButtons, { type CustomAlertWithTwoButtonsProps } from '@/components/alerts/CustomAlertWithTwoButtons.vue';
import {useTableViewStore} from '@/stores/TableViewStore';
const tableViewStore = useTableViewStore();

const props = defineProps({
    colDef: Object,
    rowData: Object,
    buttonFunction: Function
});
const emit = defineEmits(['refresh']);

onUnmounted(()=>{
    push.destroyAll();
});
</script>

<style scoped>
table {
    width: 100%;
    text-align: left;
    font-size: 12px;
    border-collapse: collapse;
}
tr {
    height: 47px;
}
tbody tr {
    height: 45px;
    border-bottom: 1px solid var(--main-gray-3);
}
tbody tr:hover {
    background-color: var(--main-mute-1);
}
.empty-table {
    text-align: center;
    font-size: 12px;
    margin: 40px 0;
    color: var(--main-gray-1);
}
</style>