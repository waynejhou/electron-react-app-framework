import { AppMenuCenter } from "./App/AppMenuCenter";
import { AppCommandCenter } from "./App/AppCommandCenter";
import { AppIPCMain } from "./App/AppIpcMain";
import { AppSessionCenter } from "./App/AppSessionCenter";

// Global 介面擴充，以參照重要物件
export interface IExGlobal extends NodeJS.Global {
    sessCenter: AppSessionCenter,
    mainIpc: AppIPCMain,
    cmdCenter: AppCommandCenter,
    menuCenter: AppMenuCenter,
    createSession: ()=>void
}
