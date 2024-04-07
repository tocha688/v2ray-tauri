// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::sync::{Arc, Mutex};

use autool::command::CommandCollection;
use tauri::Manager;

mod autool;

fn main() {
    /*  let ctx = Arc::new(tauri::Builder::default());
    //插件初始化
    // autool::init(&mut ctx);
    // autool::command::init(&mut ctx);
    // autool::path::init(Arc::clone(&ctx));
    // autool::fs::init(&mut ctx);
    //运行
    match Arc::try_unwrap(ctx) {
        Ok(ctx) => ctx
            .run(tauri::generate_context!())
            .expect("error while running tauri application"),
        Err(_) => eprintln!("Failed to lock mutex"),
    } */

    tauri::Builder::default()
        .plugin(autool::init())
        .setup(|app| {
            app.manage(CommandCollection::default());
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
