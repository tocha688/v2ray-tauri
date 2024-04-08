<script setup lang="ts">
import { http } from "@tauri-apps/api"
import { links } from "../utils/setting"
import v2rayUtils from "../utils/v2rayUtils"
import { Base64 } from "js-base64";
import { proxys } from "../utils/setting"
import { Loading, Notify } from "quasar"
import { startServer } from "../utils/server";

function openSetting() {
    (window as any).winSettings.show()
}
function openLinkPage() {
    (window as any).winLink.show()
}
async function onUpdateLinks() {
    const ls = links.value.filter((x: any) => {
        return x.url?.trim() && x.enable
    })
    if (ls.length < 1) {
        return Notify.create("没有需要更新的订阅")
    }
    Loading.show();
    //更新
    let resp = await Promise.all(ls.map(async (x: any) => {
        const dexUrl = x.url;
        return await http.fetch(dexUrl, {
            timeout: 1000 * 60 * 3,
            method: "GET",
            responseType: 2
        })
            .then(x => x.data)
            .then(x => Base64.decode(x as string))
            .then(x => x.split("\n").filter(x => !!x))
            .then(x => x.map(e => {
                let info: any;
                if (e.startsWith("ss://")) {
                    info = v2rayUtils.base64ToShadowsocks(e);
                } else if (e.startsWith("vmess://")) {
                    info = v2rayUtils.base64ToVmess(e);
                } else if (e.startsWith("socks://")) {
                    info = v2rayUtils.base64ToSocks(e);
                }
                return {
                    ...info,
                    dex: dexUrl
                };
            })).catch((e) => {
                console.log(dexUrl, "更新失败", e)
                return null
            })
    }))
    resp = resp.filter(x => !!x)
    console.log(resp)
    if (resp.length > 0) {
        //更新列表
        let newProxys = proxys.value.filter(x => !x.dex);
        resp.forEach((x: any) => {
            newProxys.push(...x)
        })
        proxys.value = newProxys;
        Notify.create("更新完成")
    } else {
        Notify.create("更新失败")
    }
    //更新完成
    Loading.hide();
}
//添加服务
function onAddSocks() {
    (window as any).winServer.add()
}
async function onReloadServer() {
    Loading.show();
    await startServer()
        .catch(() => { })
    Loading.hide();
    Notify.create("服务重启成功!")
}

</script>

<template>
    <div class="app bg-primary text-white">
        <!-- <q-btn-dropdown flat dense color="primary" label="添加">
            <q-list>
                <q-item clickable v-close-popup @click="onItemClick">
                    <q-item-section>
                        <q-item-label>Photos</q-item-label>
                    </q-item-section>
                </q-item>

                <q-item clickable v-close-popup @click="onItemClick">
                    <q-item-section>
                        <q-item-label>Videos</q-item-label>
                    </q-item-section>
                </q-item>

                <q-item clickable v-close-popup @click="onItemClick">
                    <q-item-section>
                        <q-item-label>Articles</q-item-label>
                    </q-item-section>
                </q-item>
            </q-list>
        </q-btn-dropdown> -->
        <q-btn @click="onAddSocks" title="添加" flat dense icon="add_circle_outline" class="q-mr-sm" />
        <q-btn @click="openSetting" title="设置" flat dense icon="settings" class="q-mr-sm" />
        <q-btn @click="onReloadServer" flat dense icon="restart_alt" title="重启服务" class="q-mr-sm" />
        <q-btn @click="openLinkPage" flat dense icon="manage_accounts" title="订阅设置" class="q-mr-sm" />
        <q-btn @click="onUpdateLinks" flat dense icon="cloud_download" title="更新订阅" class="q-mr-sm" />
    </div>
</template>
<style scoped lang="scss">
.app {
    padding: 4px;
}
</style>