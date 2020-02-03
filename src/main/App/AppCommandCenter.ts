import { dialog, App, FileFilter, BrowserWindow, shell } from 'electron'
import * as AppIpc from '../../shared/AppIpcData'
import * as path from 'path'
import * as fs from 'fs'
import * as crypto from 'crypto';
import { IHost } from '../../shared/IAppIpcHost';
import { AppIPCMain } from './AppIpcMain';
import { Session } from './AppSession';
import { Document } from '../../shared/Document'
import { IExGlobal } from '../IExGlobal';

function getExGlobal(): IExGlobal { return <IExGlobal>global }
const g = getExGlobal();

function newFileFilter(name: string, exts: string[]): FileFilter {
    return {
        name: name,
        extensions: exts
    }
}

export class AppCommandCenter implements IHost {
    public hostName: string = null;
    public onGotMsg: (msg: AppIpc.Message) => void;
    private app: App = null;
    public constructor(app: App) {
        this.hostName = "cmdCenter"
        this.app = app;
    }
    public openTextDialogAndShow(args:any): void {
        let optSess:Session = null
        let optIpc:AppIPCMain = g.sessCenter.lastFocusSess.ipc
        if( args && args.sess){
            optSess = args.sess
            optIpc = optSess.ipc
        }
        this.openTextDialog(optSess)
            .then((value) => {
                const fp = value.filePaths[0];
                fs.readFile(fp, (err, data) => {
                    if (err) return;
                    optIpc.send(new AppIpc.Message(
                        "cmdCenter", "renderer", new AppIpc.Command(
                            "update", "current", new Document(fp, data.toString())
                        )
                    ))
                })
            })
    }

    public openTextDialog(sess?:Session) {
        let optWindow = null
        if(sess) optWindow = sess.rendererWindow
        return dialog.showOpenDialog(optWindow, {
            filters: [
                newFileFilter('Text File', ['txt', 'md', 'json']),
                newFileFilter('All', ['*'])
            ],
            title: "Open Text",
            properties: ['openFile'],
        })
    }

    public openNewWindow(args:any){
        g.createSession()
    }




}