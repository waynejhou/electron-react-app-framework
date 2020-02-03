import { IHost } from "../../shared/IAppIpcHost";
import { App, MenuItemConstructorOptions, Menu } from "electron";
import { AppCommandCenter } from "./AppCommandCenter";
import * as AppIpc from '../../shared/AppIpcData'
import {IExGlobal} from '../IExGlobal'
function getExGlobal(): IExGlobal { return <IExGlobal>global }
const g = getExGlobal();

export class AppMenuCenter implements IHost {
    public hostName: string;
    private app: App = null;
    private cmds: AppCommandCenter = null;
    private cmdArgs: any = null;
    private static isMac: boolean = process.platform === 'darwin'

    private get macMenuHeaderTemplate(): MenuItemConstructorOptions[] {
        return (AppMenuCenter.isMac ? [{
            label: this.app.name,
            submenu: [{ role: <'about'>'about' }]
        }] : [])
    }

    private get closeOrQuit(): MenuItemConstructorOptions {
        return AppMenuCenter.isMac ? { role: <'close'>'close' } : { role: <'quit'>'quit' }
    }

    public constructor(app: App, cmds: AppCommandCenter) {
        this.hostName = "menuCenter";
        this.app = app;
        this.cmds = cmds
        this.menus = this.generateMenus();
        this.cmdArgs = null
    }

    public menus: { [name: string]: Menu }
    private generateMenus(): { [name: string]: Menu } {
        return {
            index: Menu.buildFromTemplate(
                [
                    ... this.macMenuHeaderTemplate,
                    {
                        label: '&File',
                        submenu: [
                            {
                                label: "&Open Text",
                                click: () => { this.cmds.openTextDialogAndShow(this.cmdArgs) }
                            },
                            {
                                label: "&Open New Window",
                                click: () => { this.cmds.openNewWindow(this.cmdArgs) }
                            },
                            this.closeOrQuit
                        ]
                    },
                ]
            )
        };
    }



    public onGotMsg(msg: AppIpc.Message): any {
        for (let index = 0; index < msg.commands.length; index++) {
            const cmd = msg.commands[index];
            if (cmd.action == 'popup') {
                this.cmdArgs = {sess: g.sessCenter.get(cmd.data.sessionName)}
                this.menus[cmd.request].popup()
            }
        }
    };


}