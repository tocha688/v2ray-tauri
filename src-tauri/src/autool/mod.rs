use tauri::{
    plugin::{Builder as PluginBuilder, TauriPlugin},
    Runtime,
};

pub mod au_struct;
pub mod command;
pub mod fs;
pub mod path;

//初始化
pub fn init<R: Runtime>() -> TauriPlugin<R> {
    PluginBuilder::new("autool")
        //command
        .invoke_handler(tauri::generate_handler![
            //path
            path::au_current_dir,
            //fs
            fs::au_fs_write_text,
            //command
            command::au_command_new,
            command::au_command_child_kill,
        ])
        
        .build()
}
