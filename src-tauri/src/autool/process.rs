use std::io::Error;

//根据pi结束进程
#[tauri::command(async)]
pub fn au_process_kill_by_id(process_id: u32) -> Result<String,String> {
    match kill_tree::blocking::kill_tree(process_id) {
        Ok(e) => Ok("success".to_string()),
        Err(e) => Err(e.to_string()),
    }
}
//
#[tauri::command(async)]
pub fn au_process_kill_by_port(port: u16) -> Result<bool, String> {
    match port_killer::kill(port) {
        Ok(e) => Ok(e),
        Err(e) => Err(e.to_string()),
    }
}
//
#[tauri::command(async)]
pub fn au_process_kill_by_ports(ports: Vec<u32>) -> Result<bool, String> {
    match port_killer::kill_by_pids(&ports) {
        Ok(e) => Ok(e),
        Err(e) => Err(e.to_string()),
    }
}
