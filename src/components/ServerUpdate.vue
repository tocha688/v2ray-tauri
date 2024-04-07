<script setup lang="ts">
import { computed, ref, watch } from "vue"
const def_data = () => ({
    port: "",
    address: "",
    username: "",
    password: "",
    method: "none",
    title: "",
    //vmess配置
    id: "",
    aid: "",
})
const type = ref("shadowsocks")

const data = ref(def_data())
// const ref_ip = /^(^((2[0-4]\d.)|(25[0-5].)|(1\d{2}.)|(\d{1,2}.))((2[0-5]{2}.)|(1\d{2}.)|(\d{1,2}.){2})((1\d{2})|(2[0-5]{2})|(\d{1,2})))$/;
const encryptionOptions = computed(() => {
    if (type.value == "shadowsocks") {
        return ["none", "plain", "aes-128-gcm", "aes-256-gcm", "chacha20-poly1305", "chacha20-ietf-poly1305"]
    } else if (type.value == "vmess") {
        return ["zero", "none", "auto", "chacha20-poly1305", "aes-128-gcm"]
    }
    return [];
})
//监听
watch(type, (val) => {
    if (val == "shadowsocks") {
        data.value.method = "none"
    } else if (val == "vmess") {
        data.value.method = "auto"
    }
})
const isShow = ref(false);

function onSubmit() {

}
function onClose() {
    isShow.value = false;
}
//
(window as any).winServer = {
    add() {
        data.value = def_data();
        isShow.value = true;
    },
    update(idata: any) {
        data.value = idata;
        isShow.value = true;
    },
    clsoe() {
        onClose();
    }
}
</script>

<template>
    <div class="popcontiner" v-if="isShow">
        <q-form @submit="onSubmit" class="q-gutter-md formContiner">
            <div class="types">
                <q-radio v-model="type" dense checked-icon="task_alt" unchecked-icon="panorama_fish_eye"
                    val="shadowsocks" label="Shadowsocks" />
                <q-radio v-model="type" dense checked-icon="task_alt" unchecked-icon="panorama_fish_eye" val="vmess"
                    label="Vmess" />
                <q-radio v-model="type" dense checked-icon="task_alt" unchecked-icon="panorama_fish_eye" val="socks"
                    label="Socks" />
            </div>
            <q-input class="input" dense v-model="data.title" label="别名" />
            <div class="row">
                <q-input class="input col-7" dense v-model="data.address" label="地址" />
                <q-input class="input col-5" type="number" dense v-model="data.port" label="端口" />
            </div>
            <template v-if="['vmess'].includes(type)">
                <q-input class="input" dense v-model="data.id" label="用户ID" />
                <q-input class="input" dense v-model="data.aid" label="额外ID" />
            </template>

            <!-- 地址和密码 -->
            <q-input v-if="['socks'].includes(type)" class="input" dense v-model="data.username" label="账户" />
            <!-- 密码只有ss和socks有 -->
            <q-input v-if="['socks', 'shadowsocks'].includes(type)" class="input" dense type="password"
                v-model="data.password" label="密码" />

            <template v-if="['shadowsocks', 'vmess'].includes(type)">
                <q-select class="input" options-dense dense v-model="data.method" :options="encryptionOptions"
                    label="加密方式" />
            </template>

            <div class="center">
                <q-btn class="btn" dense label="确定" type="submit" color="primary" />
                <q-btn class="btn" @click="onClose" dense outline label="取消" color="red-4" />
            </div>
        </q-form>
    </div>
</template>

<style scoped lang="scss">
.types {
    display: flex;
    flex-flow: row wrap;
    column-gap: 12px;
    padding-bottom: 8px;
}

.formContiner {
    // gap: 2px;
    display: flex;
    flex-flow: column nowrap;
}

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

    .input {
        margin-top: 0;
        background-color: #fff;
        padding: 0 4px;
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
