<script setup lang="ts">
import { computed, ref } from "vue"
import { links } from "../utils/setting"
const isShow = ref(false);


const columns = ref([
    { name: 'url', label: '订阅地址', field: 'url', align: true },
    { name: 'buttons', label: '操作', field: 'buttons', align: true, style: { width: "50px" } },
]);

function onSubmit() {
    onClose();
}
function onClose() {
    isShow.value = false;
}
function onAdd() {
    if (links.value[links.value.length - 1] && !links.value[links.value.length - 1]?.url?.trim()) {
        return;
    }
    links.value.push({ url: "", enable: false })
}
function onRemove(index: number) {
    links.value.splice(index, 1)
    if (links.value.length < 1) {
        onAdd();
    }
}
//
(window as any).winLink = {
    show() {
        // data.value = def_data();
        isShow.value = true;
    },
    clsoe() {
        onClose();
    }
}

const pagination = ref({ rowsPerPage: 0 })
</script>

<template>
    <div class="popcontiner" v-if="isShow">
        <q-table class="table" :rows="links" virtual-scroll hide-bottom dense :columns="columns as any" flat bordered
            v-model:pagination="pagination" square no-results-label="没有订阅地址" separator="cell" row-key="name">
            <template v-slot:body="props">
                <q-tr :props="props">
                    <q-td key="url" :props="props">
                        <q-input v-model="links[props.rowIndex].url" dense />
                    </q-td>
                    <q-td key="buttons" :props="props">
                        <q-toggle title="是否启用" class="toggle" size="sm" dense v-model="links[props.rowIndex].enable" />
                        <q-btn title="删除" flat outline dense icon="clear" @click="onRemove(props.rowIndex)" />
                    </q-td>
                </q-tr>
            </template>
        </q-table>
        <div class="center">
            <q-btn class="btn" @click="onAdd" dense icon="add" color="primary" />
            <q-btn class="btn" dense label="确定" @click="onSubmit" color="primary" />
            <q-btn class="btn" @click="onClose" dense outline label="取消" color="red-4" />
        </div>
    </div>
</template>

<style scoped lang="scss">
.popcontiner {
    background-color: #f6f6f6;
    height: 100vh;
    width: 100vw;
    position: fixed;
    top: 0;
    left: 0;

    // padding: 20px 5px;
    .table {
        max-height: calc(100% - 52px);

        ::v-deep {

            .q-table__top,
            .q-table__bottom,
            thead tr:first-child th {
                background-color: #ffffff
            }

            thead tr th {
                position: sticky;
                z-index: 1;
            }

            thead tr:first-child th {
                top: 0;

                &.q-table--loading thead tr:last-child th {
                    top: 48px
                }

                tbody {
                    scroll-margin-top: 48px
                }
            }
        }

    }

    .input,
    .toggle {
        margin-top: 0;
        background-color: #fff;
    }

    .toggle {
        margin-right: 4px;
    }

    .center {
        gap: 10px;
        display: flex;
        justify-content: center;
        padding-top: 10px;
    }

    .btn {
        padding: 4px 15px;
    }
}
</style>
