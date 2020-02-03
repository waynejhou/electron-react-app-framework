console.log(location.search)
import ReactDOM from 'react-dom';
import React, { Component } from 'react';
import * as AppIpc from '../shared/AppIpcData';
import { ipcRenderer, IpcRenderer } from 'electron'
import { AppIpcRenderer } from './AppIpcRenderer'
import { Document as DocumentProps } from '../shared/Document'
import './app.css'


class GetParameters {
    public name: string;
    public constructor(getString: string) {
        const parameters = new URLSearchParams(location.search)
        this.name = parameters.get('name');
    }
}

const parameters = new GetParameters(location.search)
const ipc = new AppIpcRenderer(parameters.name)
window.addEventListener('focus', (ev) => {
    console.log('window focued')
    AppIpcRenderer.send2main(new AppIpc.Message('renderer', 'sessCenter', new AppIpc.Command(
        'focus', parameters.name
    )))
});


const Document: React.FC<DocumentProps> = (props) => {
    document.title = `${props.path} - ${parameters.name}`
    return (
        <div id='root' className="document">
            <div id='title' className='document'>
                <div className='title'>{props.path}</div>
            </div>
            <div id='context' className='document'>
                <pre className='context'>{props.context}</pre>
            </div>
        </div>
    )
}

class AppProps {
    public ipc: AppIpcRenderer = null
}
const App: React.FC<AppProps> = (props) => {
    return (
        <div id='root' className='app'
            onContextMenu={(ev) => {
                props.ipc.send(new AppIpc.Message(
                    'renderer', 'menuCenter', new AppIpc.Command(
                        'popup', 'document', { sessName: parameters.name }
                    )
                ))
            }}>
            <div id='document-placeholder'></div>
        </div>
    )
}


function ReRenderDocument(props:DocumentProps){
    ReactDOM.render(
        <Document path={props.path} context={props.context}></Document>,
        document.getElementById('document-placeholder')
    );
}
function ReRenderApp(props:AppProps){
    ReactDOM.render(
        <App ipc={props.ipc}></App>,
        document.getElementById('app-placehold'),
        ()=>{
            ReRenderDocument({path:"", context:""})
        }
    );
}


ipc.onGotMessageFrom('cmdCenter', 'update', (req, data) => {
    console.log(req)
    console.log(data)
    ReRenderDocument(data)
})

ReRenderApp({ipc:ipc})


