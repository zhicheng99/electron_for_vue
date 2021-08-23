import { app, protocol, BrowserWindow, ipcMain, Menu, dialog, globalShortcut } from 'electron'
import {
  createProtocol
} from "vue-cli-plugin-electron-builder/lib";
const fs = require("fs")  //引入node原生fs模块
const os = require("os")
const isDevelopment = process.env.NODE_ENV !== "production";
let mainWindow
// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  { scheme: "app", privileges: { secure: true, standard: true } }
]);
const path = require('path')
const menus = [{
  label: '视图',
  submenu: [{
    label: '刷新',
    role: 'reload'
  },
  {
    label: '退出',
    role: 'quit'
  }]
}]
const menu = Menu.buildFromTemplate(menus)

function createWindow () {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    show: false,
    webPreferences: {
      enableRemoteModule: true, // 允许弹框
      webSecurity: false,
      nodeIntegration: true,
      nodeIntegrationInWorker: true, // 在Web工作器中启用了Node集成

      preload: path.join(__dirname, 'preload.js'),
      defaultEncoding: 'utf-8'
    }
  })
  mainWindow.once('ready-to-show', () => {
    mainWindow.show()
  })


  if (process.env.WEBPACK_DEV_SERVER_URL) { // 开发环境
    // Load the url of the dev server if in development mode
    mainWindow.loadURL(process.env.WEBPACK_DEV_SERVER_URL)
    if (!process.env.IS_TEST) mainWindow.webContents.openDevTools();
    globalShortcut.register('CommandOrControl+Shift+i', function () { //  使用快捷键shift+ctrl+i  调起开发工具
      mainWindow.webContents.openDevTools()
    })

  } else { //  生产环境
    // mainWindow.webContents.openDevTools() //  生产环境关闭调试工具
    // Load the index.html when not in development
    createProtocol('app')
    // Load the index.html when not in development
    mainWindow.loadURL('app://./index.html')
  }
  Menu.setApplicationMenu(menu)
}


/**
 * 初始化
 */
app.whenReady().then(() => {


  createWindow()
  app.setAppUserModelId('管理平台')
  // 点击MacOS底部菜单时重新启动窗口
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

// 兼容MacOS系统的窗口关闭功能
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
  mainWindow = null
})
// 最小化窗口（自定义导航条时）
ipcMain.on('window-min', () => {
  mainWindow.minimize()
})
// 最大化窗口（自定义导航条时）
ipcMain.on('window-max', () => {
  // 如果已经是最大化窗口就还原
  if (mainWindow.isMaximized()) {
    mainWindow.restore();
  } else {
    mainWindow.maximize()
  }
})
// 关闭窗口
ipcMain.on('window-close', () => {
  mainWindow.close()
  mainWindow = null;
  app.exit();
})

// 主进程给进程通信

ipcMain.on('toMain', function (event, arg) {

  event.sender.send('fromMain', arg); // 返回给渲染进程

});
// 下载进程
ipcMain.on('downLoad', function (event, arg) {
  mainWindow.webContents.downloadURL(arg.url);
});
// 调用文件读入方法
ipcMain.on('judgeUse', function (event, arg) {
  // 读入文件
// 异步返回
  fs.readFile("./authorize.bin", { encoding: "utf-8" }, (err, data) => {
    // if (err) {
    //   // dialog.showMessageBox({
    //   //   type: 'error',
    //   //   title: '找不到authorize.bin文件',
    //   //   message: err.path,
    //   //   buttons: ['ok']
    //   // }).then((index) => {
    //   //   if (index.response === 0) {
    //   //     mainWindow.close()
    //   //     mainWindow = null;
    //   //     app.exit();
    //   //   }
    //   // })
    //   event.sender.send('fromMain', null); // 返回给渲染进程
    // } else {
    //   event.sender.send('fromMain', data); // 返回给渲染进程
    // }
    event.reply('authorizeBack', data); // 返回给渲染进程
  })

});
// 读取本地服务的IP 地址 同步
ipcMain.on('syncGetLocalServer', function (event, arg) {
  // 读入文件，同步返回数据
  fs.readFile("./localServer.xml", { encoding: "utf-8" }, (err, data) => {
    event.returnValue=data; // 返回给渲染进程
  })
});
// 读取本地服务的IP 地址 异步
ipcMain.on('asyncGetLocalServer', function (event, arg) {
  // 读入文件
// 异步返回
  fs.readFile("./localServer.xml", { encoding: "utf-8" }, (err, data) => {
    event.reply('asyncBackLocalServer', data); // 返回给渲染进程
  })

});
//隐藏按钮
ipcMain.on('hideMenu', function (event, arg) {
  mainWindow.setMenu(null);
});
//显示按钮
ipcMain.on('showMenu', function (event, arg) {
  mainWindow.setMenu(menu);
});

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === "win32") {
    process.on("message", data => {
      if (data === "graceful-exit") {
        app.quit();
      }
    });
  } else {
    process.on("SIGTERM", () => {
      app.quit();
    });
  }
}