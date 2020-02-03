export class Document{
    public path:string;
    public context:string;
    public constructor(path:string, context:string){
        this.path = path;
        this.context = context;
    }
}