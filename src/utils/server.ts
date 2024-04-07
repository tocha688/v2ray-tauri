import { createdConfig } from "./config"
import { resolveResource, executableDir, join, dirname } from '@tauri-apps/api/path';
import { writeTextFile, BaseDirectory } from '@tauri-apps/api/fs';
import { Child, Command } from '@tauri-apps/api/shell';
import { current_dir, fs_write_text } from "./AuTools";
import * as AuTools from "./AuTools";
import { AuCommand } from "./AuTools/AuCommand";
import { TauriEvent } from "@tauri-apps/api/event";
import { appWindow, getCurrent } from "@tauri-apps/api/window";
import { AuProcess } from "./AuTools/AuProcess";
import { settings } from "./setting"
import { Loading, Notify } from "quasar"

const _window = window as any

//启动服务
export async function startServer() {
    _window._v2ray_start = true;
    Loading.show()
    const config = createdConfig();
    //将config写入到config.json
    const appPath = await current_dir()
    // console.log(appPath)
    const v2rayBase = appPath + "\\resources\\v2ray-core";
    const configPath = v2rayBase + "\\config.json";
    const v2rayPath = v2rayBase + "\\v2ray.exe";
    // console.log(configPath, v2rayPath)
    await writeTextFile(configPath, JSON.stringify(config))
    if ((window as any).v2rayServer) {
        await (window as any).v2rayServer.kill().catch((e: any) => {
            console.error("进程终止失败", e)
        });
    }
    //结束端口占用进程
    await AuProcess.kill_by_ports([
        settings.value.local.socks.port,
        settings.value.local.http.port
    ])

    // //创建命令
    const command = new AuCommand(v2rayPath, ["run"], {
        cwd: v2rayBase
    }, "v2ray");
    command.on('close', data => {
        console.log(`v2ray关闭进程： ${data}`);
        let v2rayServer = (window as any).v2rayServer
        if (v2rayServer !== command._child || _window._v2ray_start) return;
        setTimeout(()=>startServer(),5000)
    });
    command.on('error', error => console.error(`v2ray错误: "${error}"`));
    command.stdout.on('data', line => console.log(line));
    command.stderr.on('data', line => console.log(line));
    //运行子进程
    const child = (window as any).v2rayServer = await command.spawn();
    _window.reloadTimer && clearTimeout(_window.reloadTimer);
    _window._v2ray_start = false;
    console.log('pid:', child.pid);
    Loading.hide()
}
export async function closeServer() {
    if ((window as any).v2rayServer) {
        await (window as any).v2rayServer.kill().catch((e: any) => {
            console.error("进程终止失败", e)
        });
    }
}
//监听关闭事件，同步结束服务
appWindow.listen(TauriEvent.WINDOW_CLOSE_REQUESTED, async () => {
    await closeServer();
    appWindow.close();
})
