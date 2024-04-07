import { invoke, window, event } from "@tauri-apps/api";
import { EventEmitter } from "events"
import { current_dir } from "../AuTools";

export enum CommandEvents {
    Error = "error",
    Close = "close",
}

export type SpawnOptions = {
    cwd?: string,
    encoding?: string,
    env?: Record<string, string> | null
}

export class Child {
    pid: number;
    id: string;
    public _iskill = false;
    constructor(pid: number, id: string) {
        this.pid = pid;
        this.id = id;
    }
    async kill() {
        if (this._iskill) return Promise.resolve();
        return await invoke("plugin:autool|au_command_child_kill", {
            id: this.id
        }).then(() => {
            this._iskill = true;
        })
    }
    async write(data: string | Uint8Array) {
        if (this._iskill) return Promise.resolve();
    }
}
export type ResultOptions = {
    pid: number,
    status?: string,
    message?: string,
}

//命令行
export class AuCommand extends EventEmitter {
    id: string;
    pid?: number;
    stdout = new EventEmitter();
    stderr = new EventEmitter();
    //命令
    command: string;
    args: string[];
    options: SpawnOptions;
    _child?: Child;

    constructor(command: string, args?: string[], options?: SpawnOptions, id?: string) {
        super()
        this.id = id || Date.now() + "";
        this.command = command;
        this.args = args || [];
        this.options = options || {};
    }
    //运行
    async spawn(): Promise<Child> {
        const id = this.id;
        const _this = this;
        _this.options.cwd ||= await current_dir();
        _this.options.encoding ||= "utf-8";
        _this.options.env ||= null;
        //监听事件
        window.appWindow.listen("au://events/error/" + id, function (data) {
            const rd: ResultOptions = data.payload as any;
            if (rd.pid == _this.pid) {
                _this.emit("error", rd.message)
            }
        })
        window.appWindow.listen("au://events/close/" + id, function (data: any) {
            const rd = data.payload;
            if (rd.pid == _this.pid) {
                if (_this._child) {
                    _this._child._iskill = true;
                }
                _this.emit("close", rd)
            }
        })
        window.appWindow.listen("au://events/stdout/" + id, function (data) {
            const rd: ResultOptions = data.payload as any;
            if (rd.pid == _this.pid) {
                _this.emit("data", rd.message)
            }
        })
        window.appWindow.listen("au://events/stderr/" + id, function (data) {
            const rd: ResultOptions = data.payload as any;
            if (rd.pid == _this.pid) {
                _this.emit("data", rd.message)
            }
        })
        //
        const data = {
            cmds: _this.command,
            args: _this.args,
            options: _this.options,
            id: this.id
        };
        return new Promise(async r => {
            window.appWindow.once("au://events/init/" + id, function (data) {
                _this.pid = data.payload as number;
                _this._child = new Child(_this.pid, _this.id)
                r(_this._child)
            })
            this.pid = await invoke("plugin:autool|au_command_new", data)
        })
    }

}