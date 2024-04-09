use std::{
    env,
    fmt::format,
    sync::{Arc, Mutex},
};

use tauri::{Builder, Wry};

#[tauri::command]
pub fn au_current_dir() -> Result<String, String> {
    match env::current_dir() {
        Ok(e) => {
            let adr = format!("{}\\target\\debug", e.display().to_string());
            if cfg!(debug_assertions) {
                Ok(adr)
            } else {
                Ok(e.to_str().unwrap().to_string())
            }
        }
        Err(e) => Err(e.to_string()),
    }
}
