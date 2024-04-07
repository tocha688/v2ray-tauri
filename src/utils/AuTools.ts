// import { SpawnOptions } from "@tauri-apps/api/shell";
import { invoke, window, event } from "@tauri-apps/api";
// import { CommandConfig } from "./AuTools/Command";


// export async function waitCommand(config: CommandConfig | string, callback?: Function) {
//     if (typeof config == "string") {
//         config = {
//             cmd: config
//         };
//     }
//     const id = Date.now()
//     window.appWindow.listen("au://events/command_error/" + id, function (data) {
//         console.log(data.payload)
//     })
//     window.appWindow.listen("au://events/command_init/" + id, function (data) {
//         console.log(data.payload)
//     })
//     window.appWindow.listen("au://events/command_read_line/" + id, function (data) {
//         console.log("command_read_line", data.payload)
//         callback && callback(...arguments)
//     })
//     const data = {
//         rcmd: config.cmd,
//         args: config.args instanceof Array ? config.args : [],
//         workingDirectory: config.directory || await current_dir(),
//         id: id + ""
//     };
//     console.log(await invoke("plugin:autool|au_command_run", data))
//     //结束
// }

export async function current_dir(): Promise<string> {
    return await invoke("plugin:autool|au_current_dir")
}

export async function fs_write_text(path: string, data: string) {
    return await invoke("plugin:autool|au_fs_write_text", { path, data })
}