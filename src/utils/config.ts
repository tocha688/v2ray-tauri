import { proxyInfo, settings as _settings } from "./setting"
import v2rayUtils from "./v2rayUtils";
//生产代理配置
export function getProxyConfig() {
    if (!proxyInfo.value) {
        return;
    }
    if (proxyInfo.value.protocol == "shadowsocks") {
        return v2rayUtils.config_shadowsocks(proxyInfo.value)
    } else if (proxyInfo.value.protocol == "vmess") {
        return v2rayUtils.config_vmess(proxyInfo.value)
    } else if (proxyInfo.value.protocol == "socks") {
        return v2rayUtils.config_socks(proxyInfo.value)
    }
}
//生成配置文件
export function createdConfig() {
    const settings: any = _settings.value;
    const proxy: any = getProxyConfig();
    if (!proxy) return;
    //------------------routing start
    const routing: any = {
        //ip策略 "AsIs" | "IPIfNonMatch" | "IPOnDemand"
        "domainStrategy": settings?.routing?.domainStrategy || "IPIfNonMatch",
        rules: [
            {//广告屏蔽
                "type": "field",
                "port": null,
                "outboundTag": "block",
                "ip": null,
                "domain": [
                    "geosite:category-ads-all"
                ]
            },
            // {//放过
            //     "type": "field",
            //     "port": null,
            //     "outboundTag": "direct",
            //     "ip": null,
            //     "domain": [
            //         "microsoft.com",
            //         "microsoftonline.com",
            //         "windows.net",
            //         "windowsupdate.com",
            //         "sharepoint.com",
            //         "office.com",
            //         "live.com",
            //         "live.net",
            //         "epicgames.com",
            //         "epicgames-download1.akamaized.net",
            //         "steampowered.com",
            //         "steamcontent.com",
            //         "dl.steam.ksyna.com",
            //         "dl.steam.clngaa.com",
            //         "cdn.mileweb.cs.steampowered.com.8686c.com",
            //         "heartbeat.dm.origin.com",
            //         "steampipe.steamcontent.tnkjmec.com"
            //     ]
            // }
        ]
    }
    if (settings?.routing) {
        const type = settings.routing.type;
        if (["local", "local_and_cn"].includes(type)) {
            //放过内网
            routing.rules.push({
                "type": "field",
                "port": null,
                "outboundTag": "direct",
                "ip": [
                    "geoip:private"
                ],
                "domain": null
            })
        }
        if (["cn", "local_and_cn"].includes(type)) {
            //放过大陆地址
            routing.rules.push(/* {
                "type": "field",
                "port": null,
                "outboundTag": "direct",
                "ip": [
                    "geoip:cn"
                ],
                "domain": null
            },  */{
                "type": "field",
                "port": null,
                "outboundTag": "direct",
                "ip": [
                    "geoip:cn"
                ],
                "domain": [
                    "geosite:cn"
                ]
            })
        }
        //全部代理
        routing.rules.push({
            "type": "field",
            "port": null,
            "outboundTag": "proxy",
            "ip": null,
            "domain": [
                "geosite:geolocation-!cn"
            ]
        })
    }
    //mux
    if (settings.mux) {
        proxy.mux = {
            "enabled": true,
            "concurrency": Number(settings.mux) || 8
        }
    }

    //------------------routing end
    const config: any = {

        "inbounds": [
            {
                "port": settings?.local?.socks?.port || 10818,
                "listen": settings?.local?.socks?.listen || "0.0.0.0",
                "protocol": "socks",
                // "sniffing": {
                //     "enabled": false,
                //     "destOverride": [
                //         "http",
                //         "tls"
                //     ]
                // },
                "settings": {
                    "auth": "noauth",
                    "clients": null,
                    "accounts": [],
                    "udp": false,
                    "ip": "127.0.0.1",
                    "userLevel": 0
                },
                "streamSettings": null
            },
            {
                "port": settings?.local?.http?.port || 10819,
                "listen": settings?.local?.http?.listen || "0.0.0.0",
                "protocol": "http",
                "sniffing": null,
                "settings": null,
                "streamSettings": null
            }
        ],
        "outbounds": [
            {//代理
                ...proxy
            },
            {//放过
                "tag": "direct",
                "protocol": "freedom",
                "settings": {
                    "vnext": null,
                    "servers": null,
                    "response": null
                },
                "streamSettings": null,
                "mux": null
            },
            {//拉黑
                "tag": "block",
                "protocol": "blackhole",
                "settings": {
                    "vnext": null,
                    "servers": null,
                    "response": {
                        "type": "http"
                    }
                },
                "streamSettings": null,
                "mux": null
            }
        ],
        "routing": routing
    }
    if (settings.log) {
        config.log = {
            "access": "Console",
            "error": "",
            "loglevel": "warning"
        };
    } else {
        config.log = {
            "access": "None",
            "error": "",
            "loglevel": "warning"
        };
    }
    if (settings.dns) {
        config.dns = {
            "servers": settings.dns.split(",")
        };
    }
    return config;
}