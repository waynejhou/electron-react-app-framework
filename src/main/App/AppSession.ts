import { BrowserWindow, App, LoadFileOptions, IpcMain, Menu } from "electron";
import { AppIPCMain } from "./AppIpcMain";
import { AppMenuCenter } from "./AppMenuCenter";
import { AppCommandCenter } from "./AppCommandCenter";
import { IExGlobal } from "../IExGlobal";

function getExGlobal(): IExGlobal { return <IExGlobal>global }
const g = getExGlobal();

export class Session {
    public rendererWindow: BrowserWindow = null;
    public ipc: AppIPCMain = null;
    public name:string = null;
    public menuCenter: AppMenuCenter = null;
    public cmdCenter: AppCommandCenter = null;
    public constructor(name:string, app:App, ipcMain:IpcMain, useDevServer: boolean = false) {
        this.name = name;
        this.rendererWindow = new BrowserWindow({
            width: 900,
            height: 900,
            minWidth: 800,
            minHeight: 600,
            webPreferences: {
                nodeIntegration: true,
                devTools: !app.isPackaged
            }
        })

        this.ipc = new AppIPCMain(this.name, ipcMain)
        this.ipc.registerProcess("renderer", this.rendererWindow)
        // and load the index.html of the app.
        if (useDevServer) {
            this.rendererWindow.loadURL(`http://localhost:8080?name=${name}`)
        } else {
            this.rendererWindow.loadFile(`www/index.html`,
            <LoadFileOptions>{
                search: `?name=${name}`
            })
        }

        // Open the DevTools.
        this.rendererWindow.webContents.openDevTools({
            mode: "detach"
        })
        // 視窗關閉時會觸發。
        this.rendererWindow.on('closed', () => {
            this.close()
        })

    }

    /**
     * Close Session 
     */
    public close() {
        g.sessCenter.remove(this.name)
        this.cmdCenter = null;
        this.menuCenter = null;
        this.ipc.close()
        this.ipc = null;
        this.name = null;
        this.rendererWindow.destroy()
        delete this.rendererWindow
        this.rendererWindow = null;
    }
}