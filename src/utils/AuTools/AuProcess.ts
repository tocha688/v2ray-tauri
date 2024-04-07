import { invoke, window, event } from "@tauri-apps/api";
import { EventEmitter } from "events"
import { current_dir } from "../AuTools";

export async function process_kill_by_id(pid: number) {
    return await invoke("plugin:autool|au_process_kill_by_id", { pid })
}

export async function process_kill_by_port(port: number) {
    return await invoke("plugin:autool|au_process_kill_by_port", { port })
}

export async function process_kill_by_ports(ports: number[]) {
    return await invoke("plugin:autool|au_process_kill_by_ports", { ports })
}

export class AuProcess {
    static kill_by_pid = process_kill_by_id;
    static kill_by_port = process_kill_by_port;
    static kill_by_ports = process_kill_by_ports;
}