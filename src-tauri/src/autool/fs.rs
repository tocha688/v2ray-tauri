use std::fs;

use tauri::{Builder, Wry};

#[tauri::command]
pub fn au_fs_write_text(path: String, data: String) -> Result<String, String> {
    match fs::write(path, data) {
        Ok(_e) => Ok("success".to_string()),
        Err(e) => Err(e.to_string()),
    }
}

