import fs from 'fs';
import * as path from 'path';

//TODO refactor and abstract as service for client Service Worker
export class ContentUpdater {
    
    static contents : { name : string, content : string }[] = [];
    
    private static counter = 0;
    
    private static maxTries = 1000;

    private static json : any;

    static update() {
        ContentUpdater.json = JSON.parse(fs.readFileSync(path.resolve('.', 'content', '_data.json')).toString());

        let files = fs.readdirSync(path.resolve('.', 'content'));
        for (let fileName of files) {
            if (fileName === '_data.json') {
                continue;
            }

            let content = fs.readFileSync(path.resolve('.', 'content', fileName)).toString();
            ContentUpdater.contents.push({
                name: fileName.slice(0, fileName.length - 3),
                content: content,
            });
        };
        
        for (let contentInfoObj of ContentUpdater.contents) {
            ContentUpdater.counter = 0;
            ContentUpdater.changeJson((key, json) => {
                if (key == contentInfoObj.name) {
                    console.log(key, json);
    
                    if (
                        json[key].childrenInfo &&
                        json[key].childrenInfo.default &&
                        json[key].childrenInfo.default[0]
                    ) {
                        json[key].childrenInfo.default[0].props.data = contentInfoObj.content;
                        console.log(`changed successfull by key ${contentInfoObj.name}`);
    
                        return true;
                    }
                }
    
                if (key === 'history') {
                    for (let entry of json[key]) {
                        if (
                            entry.url &&
                            entry.url.indexOf(contentInfoObj.name) !== -1 &&
                            entry.childrenInfo.default &&
                            entry.childrenInfo.default[0]
                        ) {
                            entry.childrenInfo.default[0].props.data = contentInfoObj.content
                            console.log(`changed successfull by url ${contentInfoObj.name}`);
            
                            return true;
                        }
                    }
                }
    
                return false;
            });

            ContentUpdater.updateJson();
        }
    }

    private static changeJson(found : ((key : string, json : any) => boolean), dataJson : any = null) : any {
        if (dataJson == null) {
            dataJson = ContentUpdater.json;
        }

        ContentUpdater.counter++;
        if (ContentUpdater.counter >= ContentUpdater.maxTries) {
            throw new Error(`Max Entries reached callback found nothing: ${found.arguments.array.forEach((arg : string) => arg)}`);
        }
        for (let key in dataJson) {
            if (!found(key, dataJson)) {
                continue;
            }

            return dataJson
        }

        for (let key in dataJson) {
            if (typeof dataJson[key] === "object") {
                return ContentUpdater.changeJson(found, dataJson[key]);
            }
        }
    }

    private static updateJson() {
        fs.writeFileSync(path.resolve('.', 'compiled', 'public', 'data.json'), JSON.stringify(ContentUpdater.json));
    }
}