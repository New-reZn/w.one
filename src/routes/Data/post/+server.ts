import { postdb } from "../../../stores/data";
import { json } from "@sveltejs/kit";
import { createWriteStream,mkdir } from 'fs';
import { v4 as uuidv4 } from 'uuid';


export async function POST({request}){
    try{
        const data = await request.formData();
        
        const file = data.get('files') as File;
        const readme=data.get('readme') as Blob;
        const oneline=data.get('oneline');
        const license=data.get('license') as Blob;
        const title=data.get('title');
        const user=data.get('user');
        const name=data.get('name');
        const date=data.get('date');
        const tagsEntry = data.get('tags');
        const {tags} = tagsEntry ? JSON.parse(tagsEntry.toString()) : null;
        const image = data.get('image');

        const buffer=new Uint8Array(await file.arrayBuffer());
        let id=uuidv4();
        try{
            mkdir(`static/media/${file.name}_${id}`,(err)=>{})
        }catch(e){
            console.log('folder exists');
        }
        const filename=`static/media/${file.name}_${id}/${file.name}_${date}.zip`
        const readme_path=`static/media/${file.name}_${id}/${file.name}_${date}_readme.md`
        const license_path=`static/media/${file.name}_${id}/${file.name}_${date}_license.md`                
        createWriteStream(filename).write(buffer,(err)=>{
            console.log(err);
        });
        createWriteStream(readme_path).write(await readme.text(),(err)=>{
            console.log(err);
        });
        createWriteStream(license_path).write(await license.text(),(err)=>{
            console.log(err);
        });


        return json({
            status:200
        })
    }catch(err:any){
        console.error(err);
        return json({
            status:404
        })
    }
}