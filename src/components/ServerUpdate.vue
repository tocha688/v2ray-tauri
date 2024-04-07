<script setup lang="ts">
import { ref } from "vue"
const def_data = () => ({
    ip: "",
    port: "",
    password: "",
    encryption: "none"
})
const data = ref(def_data())
const ref_ip = /^(^((2[0-4]\d.)|(25[0-5].)|(1\d{2}.)|(\d{1,2}.))((2[0-5]{2}.)|(1\d{2}.)|(\d{1,2}.){2})((1\d{2})|(2[0-5]{2})|(\d{1,2})))$/;
const encryptionOptions = ref(["none", "plain", "aes-256-gcm", "aes-192-gcm", "aes-128-gcm"])
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
        <q-form @submit="onSubmit" class="q-gutter-md">
            <q-input class="input" dense v-model="data.ip" label="服务器地址" />
            <q-input class="input" dense v-model="data.port" label="服务器端口" />
            <q-input class="input" dense type="password" v-model="data.password" label="密码" />
            <q-select class="input" options-dense dense v-model="data.encryption" :options="encryptionOptions"
                label="加密方式" />
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

    .input {
        margin-top: 0;
        background-color: #fff;
    }

    .center {
        gap: 10px;
        display: flex;
        justify-content: center;
    }
    .btn{
        padding: 4px 15px;
    }
}
</style>
