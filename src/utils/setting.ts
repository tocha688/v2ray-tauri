import { useStorageAsync, useUrlSearchParams, watchOnce } from '@vueuse/core'
import Storage from './Storage'
import { Ref, computed, watch, watchEffect } from 'vue'
import { startServer } from './server'

const params = useUrlSearchParams()


//默认设置
const defaultSetting = () => (
    {
        //本地代理ip设置
        "local": {
            "socks": {
                "port": 10818,
                "listen": "0.0.0.0"
            },
            "http": {
                "port": 10819,
                "listen": "0.0.0.0"
            }
        },
        "routing": {
            //ip策略 "AsIs" | "IPIfNonMatch" | "IPOnDemand"
            "domainStrategy": "IPIfNonMatch",
            //代理类型 global.全局 local.绕过局域网 cn.绕过大陆 local_and_cn.绕过局域网和大陆地址
            "type": "global"
        },
        "dns": "",
        //开机启动
        "startup": false
    }
)
export const routingDomainStrategys = ["AsIs", "IPIfNonMatch", "IPOnDemand"]
export const routingTypes = [
    { label: "全局", value: "global" },
    { label: "绕过局域网地址", value: "local" },
    { label: "绕过大陆地址", value: "cn" },
    { label: "绕过局域网和大陆地址", value: "local_and_cn" },
]
//@ts-ignore
export const settings: Ref<any> = useStorageAsync("settings", defaultSetting(), Storage)
//@ts-ignore
export const links: Ref<any[]> = useStorageAsync("links", [{ url: "", enable: false }], Storage)
//@ts-ignore 代理列表
export const proxys: Ref<any[]> = useStorageAsync("proxys", [], Storage)
//@ts-ignore 当前代理的IP
export const proxyChangeId: Ref<number> = useStorageAsync("proxy_change_id", proxys.value[0]?.id, Storage)

//当前代理信息
export const proxyInfo = computed(() => {
    if (!proxyChangeId.value) return null;
    return proxys.value.find(x => x._id == proxyChangeId.value)
})

//初始化代理信息
export async function initProxyInfo(it?: any) {
    if (it) {
        proxyChangeId.value = it?._id;
    }
    if (!proxyChangeId.value || !proxys.value.find(x => x._id == proxyChangeId.value)) {
        proxyChangeId.value = proxys.value[0]?._id;
    }
}
// console.log(params)

watch(proxyInfo, async (info: any) => {
    if (!info) {
        return;
    }
    //重新启动服务
    await startServer();
}, {
    immediate: true
})



