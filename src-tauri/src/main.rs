// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::sync::{mpsc::sync_channel, Arc, Mutex};

use autool::command::CommandCollection;
use tauri::{Manager, WindowEvent};

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
    // let (tx,rx) = sync_channel(1);
    tauri::Builder::default()
        .plugin(autool::init())
        .setup(|app| {
            app.manage(CommandCollection::default());
            Ok(())
        })
        // .on_window_event(move |event| match event.event() {
        //     WindowEvent::Destroyed => {
        //         println!("准备关闭后台API");
        //         // tx.send(-1).expect("发送关闭信号失败");
        //         println!("已关闭后台API");
        //     }
        //     _ => {}
        // })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
