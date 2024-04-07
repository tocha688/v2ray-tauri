use std::{
    collections::HashMap,
    io::{BufRead, BufReader},
    os::windows::process::CommandExt,
    process::{self, Child, Command},
    sync::{Arc, Mutex},
    thread::{self, JoinHandle},
};

use serde::{Deserialize, Serialize};
use shared_child::SharedChild;
use tauri::{api::ipc::SerializeOptions, Builder, EventLoopMessage, Runtime, State, Window, Wry};

use super::au_struct::Id;

//存储集合
#[derive(Default)]
pub struct CommandCollection(Mutex<HashMap<String, Arc<SharedChild>>>);
//类型
#[derive(Deserialize, Clone)]
pub struct SpawnOptions {
    cwd: String,
    encoding: String,
    env: Option<HashMap<String, String>>,
}

#[derive(Deserialize, Clone, Serialize)]
pub struct ResultOptions {
    pid: u32,
    status: Option<String>,
    message: Option<String>,
}

//结束子进程
#[tauri::command(async)]
pub fn au_command_child_kill<R: Runtime>(
    window: Window<R>,
    canmands: State<'_, CommandCollection>,
    id: String,
) {
    if let Some(child) = canmands.0.lock().unwrap().get(&id) {
        //结束线程
        // CommandExt
        //结束进程
        let _ = child.kill();
    }
    //删除
    canmands.0.lock().unwrap().remove(&id);
}

#[tauri::command(async)]
pub fn au_command_new<R: Runtime>(
    window: Window<R>,
    canmands: State<'_, CommandCollection>,
    cmds: String,
    args: Option<Vec<String>>,
    options: SpawnOptions,
    id: String,
) -> Result<u32, String> {
    //判断是否存在
    if let Some(child) = canmands.0.lock().unwrap().get(&id) {
        //结束线程
        // CommandExt
        println!("结束：{}", id);
        //结束进程
        let _ = child.kill();
    }
    println!("开始启动：{}", id);
    // // 定义要运行的命令（例如，运行 "ls" 命令以列出当前目录中的文件）
    // let cur_dir = match env::current_dir() {
    //     Ok(child) => child,
    //     Err(e) => return Err("无法获取当前目录".to_string()),
    // };
    // // 定义子进程的工作目录
    // let working_directory = format!("{}\\v2ray-core\\", cur_dir.display());
    // 创建一个 Command 对象并设置工作目录
    let mut cwd = process::Command::new(cmds);
    //添加参数
    if let Some(args_r) = args {
        cwd.args(args_r);
    }
    //设置环境变量
    if let Some(map) = options.env {
        cwd.envs(map);
    } else {
        //清空
        // cwd.env_clear();
    }
    //设置运行目录
    cwd.current_dir(options.cwd);
    cwd.stdout(std::process::Stdio::piped());
    cwd.stderr(std::process::Stdio::piped());
    //设置编码格式
    //运行
    let shared_child = SharedChild::spawn(&mut cwd).unwrap();
    let child_arc = Arc::new(shared_child);
    //保存child
    let pid = child_arc.id();
    //运行
    let win2 = Arc::new(Mutex::new(window));
    //stdout
    let stdout = child_arc
        .take_stdout()
        .expect("Failed to open child stdout");
    let stdout_reader = BufReader::new(stdout);
    let stdout_id = id.clone();
    let stdout_win = win2.clone();
    thread::spawn(move || {
        for line in stdout_reader.lines() {
            match line {
                Ok(line) => {
                    println!("{}", line);
                    let _ = stdout_win.lock().unwrap().emit(
                        &format!("au://events/stdout/{}", stdout_id),
                        ResultOptions {
                            pid: pid,
                            status: None,
                            message: Some(line),
                        },
                    );
                }
                Err(err) => {
                    let _ = stdout_win.lock().unwrap().emit(
                        &format!("au://events/error/{}", stdout_id),
                        ResultOptions {
                            pid: pid,
                            status: None,
                            message: Some(err.to_string()),
                        },
                    );
                    return;
                }
            }
        }
    });
    //stderr
    let stderr = child_arc
        .take_stderr()
        .expect("Failed to open child stderr");
    let stderr_reader = BufReader::new(stderr);
    let stderr_win = win2.clone();
    let stderr_id = id.clone();
    thread::spawn(move || {
        for line in stderr_reader.lines() {
            match line {
                Ok(line) => {
                    println!("{}", line);
                    let _ = stderr_win.lock().unwrap().emit(
                        &format!("au://events/stderr/{}", stderr_id),
                        ResultOptions {
                            pid: pid,
                            status: None,
                            message: Some(line),
                        },
                    );
                }
                Err(err) => {
                    let _ = stderr_win.lock().unwrap().emit(
                        &format!("au://events/error/{}", stderr_id),
                        ResultOptions {
                            pid: pid,
                            status: None,
                            message: Some(err.to_string()),
                        },
                    );
                    return;
                }
            }
        }
    });

    // //等待退出
    // let wait_win = window.clone();
    // let wait_child = child2.clone();
    canmands
        .0
        .lock()
        .unwrap()
        .insert(id.clone(), child_arc.clone());
    //回调
    let _ = win2
        .lock()
        .unwrap()
        .emit(&format!("au://events/init/{}", id), pid);
    let wait_win2 = win2.clone();
    thread::spawn(move || match child_arc.wait() {
        Ok(status) => {
            let _ = wait_win2.lock().unwrap().emit(
                &format!("au://events/close/{}", id),
                ResultOptions {
                    pid: pid,
                    status: Some(status.to_string()),
                    message: None,
                },
            );
        }
        Err(e) => {
            let _ = wait_win2.lock().unwrap().emit(
                &format!("au://events/error/{}", id),
                ResultOptions {
                    pid: pid,
                    status: None,
                    message: Some(e.to_string()),
                },
            );
        }
    });
    Ok(pid)
}
