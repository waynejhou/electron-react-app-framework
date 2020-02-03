// import electron: 應用程式基底
import { app, ipcMain, Menu } from 'electron';
import { Session } from './App/AppSession'
import { AppIPCMain } from './App/AppIpcMain';
import { IHost } from '../shared/IAppIpcHost';
import { AppSessionCenter } from './App/AppSessionCenter';
import { AppCommandCenter } from './App/AppCommandCenter';
import { AppMenuCenter } from './App/AppMenuCenter';
import { IExGlobal } from './IExGlobal';

function getExGlobal(): IExGlobal { return <IExGlobal>global }
const g = getExGlobal();
g.mainIpc = new AppIPCMain("main", ipcMain)
g.sessCenter = new AppSessionCenter()
g.mainIpc.registerHost(g.sessCenter)
g.cmdCenter = new AppCommandCenter(app)
g.mainIpc.registerHost(g.cmdCenter)
g.menuCenter = new AppMenuCenter(app, g.cmdCenter)
g.mainIpc.registerHost(g.menuCenter)
Menu.setApplicationMenu(g.menuCenter.menus.index)


const useDevServer = false;

g.createSession = () => {
    let sess = new Session(`session_${g.sessCenter.length}`, app, ipcMain, useDevServer)
    g.sessCenter.add(sess)
}

// 當 Electron 完成初始化，並且準備好建立瀏覽器視窗時
// 會呼叫這的方法
// 有些 API 只能在這個事件發生後才能用。
app.on('ready', () => {
    g.createSession()
})

// 在所有視窗都關閉時結束程式。
app.on('window-all-closed', () => {
    // 在 macOS 中，一般會讓應用程式及選單列繼續留著，
    // 除非使用者按了 Cmd + Q 確定終止它們
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', () => {
    // 在 macOS 中，一般會在使用者按了 Dock 圖示
    // 且沒有其他視窗開啟的情況下，
    // 重新在應用程式裡建立視窗。
    g.createSession()
})


