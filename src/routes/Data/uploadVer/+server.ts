import { postdb,newsdb } from "../../../stores/data";
import { json } from "@sveltejs/kit";
import { createWriteStream } from 'fs';
import { v4 as uuidv4 } from "uuid";

interface Post extends PouchDB.Find.FindResponse<{}>{
    _id: string;
    user: string;
    title: string;
    oneline: string;
    mainPoints: string[];
    tags: string[];
    likes: number;
    downloads: number;
    hasImage: boolean;
    date: string;
    dateAdded: string;
    ogFile: string;
    filename: {
        desc:string,
        file:string
    }[];
    readme: string;
    license: string;
    image: string;
}


export async function POST({request}:any) {
    const data=await request.formData();
    const user=JSON.parse(data.get('user') as string) as {name:string,key:string};
    const file = data.get('files') as File;
    const post_id = data.get('post') as string;
    const Desc = data.get('filedesc') as string;
    const date = data.get('date') as string;
    let check:any=await postdb.find({
        selector:{_id:post_id,user:user.key}
    })

    if(check.docs[0]!=undefined){
        const doc:Post=check.docs[0];
        const Jtitle=doc.title;
        const id=doc._id.split('_')[doc._id.split('_').length-1]
        const ogfile=doc.ogFile;
        const buffer=new Uint8Array(await file.arrayBuffer());
        const filename=`static/media/${ogfile}_${id}/${file.name}_${date}.zip`
        //check if file.name is same or not
        let filecheck=false;
        doc.filename.forEach(fileInArr=>{
            if(file.name===fileInArr.file.split('/')[fileInArr.file.split('/').length-1].split('_')[0]){
                filecheck=true;
                return;
            }
        })
        if(filecheck){
            return json({
                status:500
            })
        }

        createWriteStream(filename).write(buffer);
        doc.filename.push({
            desc:Desc,
            file:filename
        })
        
        const fail= await postdb.put(doc)
        if(fail.ok){
            newsdb.put({
                _id:`news_${uuidv4()}`,
                date:(new Date).toUTCString(),
                title:`${user.name} upload a new version of ${Jtitle}`
            })
            return json({
                status:200
            })
        }else{
            return json({
                status:false
            })
        }
    }
    return json({
        status:false
    })
}