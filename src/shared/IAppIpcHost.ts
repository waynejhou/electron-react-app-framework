import  * as AppIpc from "./AppIpcData";

export interface IHost {
    hostName: string
    onGotMsg: (msg: AppIpc.Message) => void
}