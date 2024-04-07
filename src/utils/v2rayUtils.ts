import { Base64 } from "js-base64";
import md5 from "md5";

export default class v2rayUtils {
    //将base64转为ss格式
    static base64ToShadowsocks(str: string) {
        //解压ss
        if (!str.startsWith("ss://")) {
            return;
        }
        //获取标题
        let b64Str = str.replace("ss://", "");
        let arr = b64Str.split("#")
        if (!arr[0]) return;
        let title = "";
        if (arr[1]) {
            try { title = decodeURIComponent(arr[1]) } catch (e) { }
        }
        //数据
        let dataStr = Base64.decode(arr[0])
        arr = dataStr.split(":");
        let accArr = arr[1].split("@");
        return {
            _id: md5(str),
            protocol: "shadowsocks",
            title,
            //加密方式
            method: arr[0],
            password: accArr[0],
            //服务器地址
            address: accArr[1],
            port: Number(arr[2]),
            _str: str
        }
    }
    //将base64转为Vmess
    static base64ToVmess(str: string) {
        if (!str.startsWith("vmess://")) {
            return;
        }
        //获取标题
        let b64Str = str.replace("vmess://", "");
        let data = JSON.parse(Base64.decode(b64Str));
        return {
            _id: md5(str),
            protocol: "vmess",
            title: data.ps,
            //加密方式
            method: "auto",
            password: data.passwd,
            //服务器地址
            address: data.add,
            port: Number(data.port),
            _str: str,
            _data: data
        }
    }
    //socks
    static base64ToSocks(str: string) {
        if (!str.startsWith("socks://")) {
            return;
        }
        let b64Str = str.replace("socks://", "");
        let arr = b64Str.split("#")
        if (!arr[0]) return;
        let title = "";
        if (arr[1]) {
            try { title = decodeURIComponent(arr[1]) } catch (e) { }
        }
        //数据
        let dataStr = Base64.decode(arr[0])
        arr = dataStr.split(":");
        return {
            _id: md5(str),
            protocol: "socks",
            title,
            //服务器地址
            address: arr[0],
            port: Number(arr[1]),
            method: "chacha20",
            username: "",
            password: "",
            _str: str
        }
    }
    static config_shadowsocks(info: any) {
        return {
            "tag": "proxy",
            "protocol": "shadowsocks",
            "settings": {
                "vnext": null,
                "servers": [{
                    "email": null,
                    address: info.address,
                    method: info.method,
                    "ota": false,
                    password: info.password,
                    port: Number(info.port),
                    "level": 1
                }],
                "response": null
            },
            "streamSettings": {
                "network": "tcp",
                "security": null,
                "tlsSettings": null,
                "tcpSettings": null,
                "kcpSettings": null,
                "wsSettings": null,
                "httpSettings": null,
                "quicSettings": null
            },
            "mux": {
                "enabled": false
            }
        }
    }
    static config_vmess(info: any) {
        const config: any = {
            "tag": "proxy",
            "protocol": "vmess",
            "settings": {
                "vnext": [
                    {
                        "address": info.address,
                        "port": Number(info.port),
                        "users": [
                            {
                                "id": info._data.id,
                                "alterId": info._data.aid || 0,
                                "email": "t@t.tt",
                                "security": info?.method || "auto"
                            }
                        ]
                    }
                ],
                "servers": null,
                "response": null
            },
            "streamSettings": {
                "network": info._data.net || "tcp",
                "security": "",
                "tlsSettings": null,
                "tcpSettings": null,
                "kcpSettings": null,
                "wsSettings": null,
                "httpSettings": null,
                "quicSettings": null
            },
            "mux": {
                "enabled": !!info.class
            }
        }
        if (info._data.net == "ws") {
            config.streamSettings.tlsSettings = {
                "allowInsecure": true,
                "serverName": null
            }
            config.streamSettings.wsSettings = {
                "connectionReuse": true,
                "path": info._data.path,
                "headers": null
            }
        }
        return config;
    }
    static config_socks(info: any) {
        let users: any = null;
        if (info.username) {
            users = [{
                user: info.username,
                pass: info.password || "",
                level: 1
            }]
        }
        const config: any = {
            "tag": "proxy",
            "protocol": "socks",
            "settings": {
                "vnext": null,
                "servers": [
                    {
                        "address": info.address,
                        "port": Number(info.port),
                        users: users
                    }
                ],
                "response": null
            },
            "streamSettings": {
                "network": "tcp",
                "security": null,
                "tlsSettings": null,
                "tcpSettings": null,
                "kcpSettings": null,
                "wsSettings": null,
                "httpSettings": null,
                "quicSettings": null
            },
            "mux": {
                "enabled": false
            }
        }
        return config;
    }
}