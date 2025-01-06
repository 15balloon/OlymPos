<template>
    <button class="button_in_table"><slot></slot></button>
</template>

<script setup lang="ts">
</script>

<style scoped>
.button_in_table {
    cursor: pointer;
    padding: 4px 10px;
    font-size: 12px;
    border-radius: 2px;
    border: 0;
    background-color: var(--main-mute-1);
    color: var(--main-black);
    box-shadow: rgba(15, 15, 15, 0.1) 0px 0px 0px 1px, rgba(15, 15, 15, 0.1) 0px 2px 0px;
    transition: 500ms cubic-bezier(0.175, 0.885, 0.32, 1.275);
}
.button_in_table:hover {
    background-color: var(--main-soft-2);
}
</style>