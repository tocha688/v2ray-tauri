<script setup lang="ts">
import { computed, ref, unref, watch } from "vue"
import { Loading, Notify } from "quasar"
import { proxyChangeId, proxys } from "../utils/setting";
import * as uuid from "uuid"
import v2rayUtils from "../utils/v2rayUtils";
import md5 from "md5";
import { margen } from "../utils/utils";
import { startServer } from "../utils/server";

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
        return ["none", "auto", "chacha20-poly1305", "aes-128-gcm"]
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
const isUpdater = ref(false);
const update_data = ref<any>();

function onSubmit() {
    //验证码名字
    const from = unref(data);
    if (!from.title) return Notify.create("请输入别名")
    //验证别名唯一性
    if (!isUpdater.value && proxys.value.find(x => x.title == from.title)) return Notify.create("别名已存在")
    //验证地址
    if (!(from.address && from.port)) return Notify.create("请输入地址和端口")
    let nConfig: any;
    if (type.value == "shadowsocks") {
        //验证密码
        if (!from.password) return Notify.create("请输入密码")
        //保存ss
        nConfig = {
            protocol: "shadowsocks",
            title: from.title,
            //加密方式
            method: from.method || "none",
            password: from.password || "",
            //服务器地址
            address: from.address || "",
            port: Number(from.port),
        }
    } else if (type.value == "vmess") {
        //验证ID
        if (!from.id) return Notify.create("请输入ID")
        //保存ss
        nConfig = {
            protocol: "vmess",
            title: from.title,
            //加密方式
            method: from.method || "none",
            password: from.password || "",
            //服务器地址
            address: from.address || "",
            port: Number(from.port),
            //
            _data: {
                "v": "2",
                "ps": from.title || "",
                "add": from.address,
                "port": from.port,
                "id": from.id,
                "aid": from.aid,
                "net": "tcp",
                "type": from.method || "none",
                "host": "",
                "path": "",
                "tls": ""
            }
        }
    } else {
        //保存socks
        nConfig = {
            protocol: "socks",
            title: from.title,
            //加密方式
            username: from.username || "",
            password: from.password || "",
            //服务器地址
            address: from.address || "",
            port: Number(from.port),
        }
    }
    if (isUpdater.value) {
        //更新
        nConfig = margen(unref(update_data), nConfig)
        //保存
        const index = proxys.value.findIndex(x => x._id == update_data.value._id)
        proxys.value[index] = nConfig;
        Notify.create("修改成功!")
        if (nConfig._id == proxyChangeId.value) {
            //重启服务
            startServer();
        }
    } else {
        //添加
        nConfig._str = v2rayUtils.getShare(nConfig)
        nConfig._id = md5(nConfig._str)
        proxys.value.push(nConfig);
        Notify.create("保存成功!")
    }
    onClose()
}
function onClose() {
    isShow.value = false;
}
//
(window as any).winServer = {
    add() {
        data.value = def_data();
        type.value = "shadowsocks";
        isShow.value = true;
        isUpdater.value = false;
    },
    update(id: any) {
        const idata = proxys.value.find(x => x._id == id)
        //
        data.value.port = idata.port;
        data.value.address = idata.address;
        data.value.username = idata.username || "";
        data.value.password = idata.password || "";
        data.value.method = idata.method || "none";
        data.value.title = idata.title;
        data.value.id = idata._data?.id || "";
        data.value.aid = idata._data?.aid || "0";
        type.value = idata.protocol;
        //
        update_data.value = idata;
        isUpdater.value = true;
        isShow.value = true;
    },
    clsoe() {
        onClose();
    }
}
const isPwdInput = ref(true)
</script>

<template>
    <div class="popcontiner" v-if="isShow">
        <q-form @submit="onSubmit" class="q-gutter-md formContiner">
            <div class="typeTitle" v-if="isUpdater">
                {{ type }}
            </div>
            <div class="types" v-if="!isUpdater">
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
                <q-input class="input" dense v-model="data.id" label="用户ID">
                    <template v-slot:append>
                        <q-btn class="btn" flat dense label="生成" color="primary" @click="data.id = uuid.v4()" />
                    </template>
                </q-input>
                <q-input class="input" dense v-model="data.aid" label="额外ID" />
            </template>

            <!-- 地址和密码 -->
            <q-input v-if="['socks'].includes(type)" class="input" dense v-model="data.username" label="账户" />
            <!-- 密码只有ss和socks有 -->
            <q-input v-if="['socks', 'shadowsocks'].includes(type)" class="input" dense
                :type="isPwdInput ? 'password' : 'text'" v-model="data.password" label="密码">
                <template v-slot:append>
                    <q-icon :name="isPwdInput ? 'visibility_off' : 'visibility'" class="cursor-pointer"
                        @click="isPwdInput = !isPwdInput" />
                </template>
            </q-input>

            <template v-if="['shadowsocks', 'vmess'].includes(type)">
                <q-select class="input" options-dense dense v-model="data.method" :options="encryptionOptions"
                    label="加密方式" />
            </template>

            <div class="center">
                <q-btn class="btn" dense :label="isUpdater ? '修改' : '添加'" type="submit" color="primary" />
                <q-btn class="btn" @click="onClose" dense outline label="取消" color="red-4" />
            </div>
        </q-form>
    </div>
</template>

<style scoped lang="scss">
.typeTitle {
    font-size: 14px;
    font-weight: bold;
    padding: 4px 6px;
    text-transform: uppercase;
    text-align: center;
}

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
    // padding: 20px 5px;

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
