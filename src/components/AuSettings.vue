<script setup lang="ts">
import { computed, ref } from "vue"
import { settings, routingDomainStrategys, routingTypes } from "../utils/setting"
import { startServer } from "../utils/server";
const isShow = ref(false);


function onSubmit() {
    //开机启动设置
    //重启服务
    startServer();
    onClose()
}
function onClose() {
    isShow.value = false;
}
//
(window as any).winSettings = {
    show() {
        // data.value = def_data();
        isShow.value = true;
    },
    clsoe() {
        onClose();
    }
}
const _routingTypes = ref(routingTypes)
const _routingDomainStrategys = ref(routingDomainStrategys)
const _routingType = computed({
    get() {
        return routingTypes.find(x => x.value == settings.value.routing.type)
    },
    set(data) {
        settings.value.routing.type = data?.value
    }
})

</script>

<template>
    <div class="popcontiner" v-if="isShow">
        <q-form @submit="onSubmit" class="q-gutter-md">
            <q-input class="input" dense v-model="settings.local.socks.port" label="Socks端口" />
            <q-input class="input" dense v-model="settings.local.http.port" label="Http/Htpps端口" />
            <q-select class="input" options-dense dense v-model="settings.routing.domainStrategy"
                :options="_routingDomainStrategys" label="域名策略" />
            <q-select class="input" options-dense dense v-model="_routingType" :options="_routingTypes" label="路由模式" />
            <q-input class="input" dense v-model="settings.dns" label="DNS策略" />
            <q-input class="input" type="number" dense v-model="settings.mux" label="Mux(1-1024)"
                placeholder="不填写则不开启，v2ray默认8" />
            <!-- <q-toggle class="toggle" label="开Mux负载均衡" size="sm" v-model="settings.isMux" /> -->
            <!-- <q-checkbox v-model="settings.isMux" label="开Mux负载均衡"/> -->
            <div class="row">
                <q-toggle class="toggle" label="开机启动" size="sm" v-model="settings.startup" />
                <q-toggle class="toggle" label="开启探测" size="sm" v-model="settings.log" />
            </div>
            <div class="center">
                <q-btn class="btn" dense label="确定" type="submit" color="primary" />
                <q-btn class="btn" @click="onClose" dense outline label="取消" color="red-4" />
            </div>
        </q-form>
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
    padding: 20px 5px;
    .row {
        margin-top: 0;
        display: flex;
        flex-flow: row nowrap;
        gap: 2px;
    }

    .input,
    .toggle {
        margin-top: 0;
        background-color: #fff;
    }

    .toggle {
        width: 100%;
    }

    .center {
        gap: 10px;
        display: flex;
        justify-content: center;
    }

    .btn {
        padding: 4px 15px;
    }
}
</style>
