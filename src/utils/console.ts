import { useUrlSearchParams } from "@vueuse/core";
import { event } from "@tauri-apps/api"
const params = useUrlSearchParams()

//@ts-ignore 日志
const win = window as any;
win.logs = win.logs as string || "";
const maxCodes = 10000 * 10;
(function () {
    if (params.log) return;
    const _console = window.console as any;
    ["log", "error"].forEach(key => {
        const k2 = '_' + key;
        _console[k2] = _console[key]
        _console[key] = function () {
            // 将arguments输出到DOM上...
            try {
                const _log = Array.from(arguments).map(x => {
                    try {
                        if (typeof x == "object") {
                            return JSON.stringify(x)
                        }
                    } catch (e) { }
                    return x;
                }).join(" ") + "\n";
                win.logs += _log;
                //保留10000个字符
                win.logs = win.logs.substring(win.logs.length - maxCodes);
                event.emit("console", win.logs)
            } catch (e) { }
            _console[k2](...arguments)
        }
    })
})()