import { contextBridge, ipcRenderer } from 'electron'
window.ipcRenderer = ipcRenderer

contextBridge.exposeInMainWorld('ipcRenderer', {
  // 异步向主进程 发送消息
  send: (channel, data) => {
    let validChannels = ['toMain', 'downLoad', 'judgeUse', 'hideMenu', 'showMenu', 'window-close', 'asyncGetLocalServer']
    if (validChannels.includes(channel)) {
      ipcRenderer.send(channel, data)
    }
  },
  // 同步向主进程 发送消息，
  sendSync: (channel, data) => {
    let validChannels = ['syncGetLocalServer']
    if (validChannels.includes(channel)) {
      return ipcRenderer.sendSync(channel, data)
    }
  },
  // 异步接收主进程返回的数据
  receive: async (channel) => {
    let validChannels = ['authorizeBack', 'asyncBackLocalServer']
    if (validChannels.includes(channel)) {
      return new Promise((resolve) => {
        ipcRenderer.on(channel, (event, ...args) => {
          resolve(...args)
        })
      });

    }
  }
})