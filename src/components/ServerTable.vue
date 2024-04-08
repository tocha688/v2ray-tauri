<script setup lang="ts">
import { onMounted, ref } from "vue";
import { proxys, proxyChangeId, initProxyInfo } from "../utils/setting"

function changePorxy(it: any) {
    initProxyInfo(it)
}

//修改
function updateProxy(index: number, it: any) {
    (window as any).winServer.update(it._id)
}

//删除
function onRemove(index: number, it: any) {
    proxys.value.splice(index, 1)
    if (it._id == proxyChangeId.value) {
        initProxyInfo()
    }
}

onMounted(() => {
    initProxyInfo();
})
</script>

<template>
    <!-- 表格 -->
    <q-virtual-scroll class="ctable" :items="proxys" separator v-slot="{ item, index }"
        v-if="proxys && proxys.length > 0">
        <q-item :key="index" dense class="irow" :class="{ select: proxyChangeId == item._id }"
            @dblclick="changePorxy(item)">
            <div>{{ item.title || item.address }}</div>
            <div class="btns">
                <q-btn flat outline dense icon="done" @click="changePorxy(item)" />
                <q-btn flat outline dense icon="edit" @click="updateProxy(index, item)" />
                <q-btn flat outline dense icon="delete" @click="onRemove(index, item)" />
            </div>
        </q-item>
    </q-virtual-scroll>
    <div v-else class="nodata">
        没有数据!
    </div>
</template>
<style scoped lang="scss">
.btns {
    min-width: 66px;
}

.nodata {
    text-align: center;
    padding: 60px 0;
    font-size: 18px;
    color: #b5b5b5;
}

.ctable {
    height: calc(100vh - 40px);
    background-color: white;
    border-top: 1px solid rgb(156, 156, 156);
    border-bottom: 1px solid rgb(206, 206, 206);

    .irow {
        display: flex;
        flex-flow: row nowrap;
        align-items: center;
        justify-content: space-between;
        font-size: 12px;
        padding: 0 2px 0 10px;

        &:hover {
            background-color: rgba(240, 240, 240, 0.8);
        }

        ::v-deep {
            i {
                font-size: 14px;
            }
        }

        &.select {
            background-color: rgb(17, 175, 85);
            color: #fff;
        }
    }
}
</style>