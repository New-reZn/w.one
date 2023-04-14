import { postdb } from "../../../stores/data";
import { error, json } from "@sveltejs/kit";
import { createWriteStream,mkdir } from 'fs';
import { v4 as uuidv4 } from 'uuid';
import nlp from 'compromise';

interface Post extends PouchDB.Core.ExistingDocument<PouchDB.Core.AllDocsMeta> {
    mainPoints: string[];
    title:string;
    ogFile:string;
}

function getMainPoints(paragraph: string): Promise<string[]> {
    return new Promise((resolve, reject) => {
      try {
        const doc = nlp(paragraph);
        const keywords = doc.nouns().concat(doc.verbs()).out('array') as string[];
        const mainPoints = keywords
          .map((word) => word.replace(/[^A-Za-z0-9\s]/g, ''))
          .filter(Boolean)
          .filter((word) => word.trim().length > 1);
        resolve(Array.from(new Set(mainPoints)));
      } catch (error) {
        reject(error);
      }
    });
}

function similarity(mainPoints1:string[],mainPoints2:string[]):number{
    return mainPoints1.filter((word) => mainPoints2.includes(word)).length / mainPoints1.length;
}

async function isDuplicate(title:string,fileName:string,mainPoints:string[]){
    const mapFunction = function(doc:any) {
      if (doc._id.startsWith('post_')) {
        // @ts-ignore
        emit(doc._id, doc);
      }
    };
    const existingPosts = await postdb.query<Post>(mapFunction,{
        include_docs: true,
        reduce: false
    });

    return existingPosts.rows.some((row) => {
      const existingPost = row.doc;
      if(existingPost!=undefined){
          const existingMainPoints = existingPost?.mainPoints;
          if(existingMainPoints) { // check if existingMainPoints is defined
            const similarityScore = similarity(mainPoints, existingMainPoints);
            const isSameTitle = title.toLowerCase() === existingPost?.title.toLowerCase();
            const isSameFilename=existingPost?.ogFile.toLowerCase() === fileName.toLowerCase();
            return (similarityScore > 0.9 &&  isSameFilename)||isSameTitle;
          }
      }
      return false; 
    });
}

export async function POST({request}:any){
    try{
        const data = await request.formData();
        
        const file = data.get('files') as File;
        const readme=data.get('readme') as File;
        const oneline=data.get('oneline');
        const license=data.get('license') as File;
        const title=data.get('title') as string;
        const fileDesc=data.get('filedesc') as string;
        const user=JSON.parse(data.get('user') as string) as {name:string,key:string};
        const date=data.get('date') as string;
        const tagsEntry = data.get('tags');
        const {tags} = tagsEntry ? JSON.parse(tagsEntry.toString()) : null;
        const image = data.get('image') as File;
        
        const buffer=new Uint8Array(await file.arrayBuffer());
        let id=uuidv4();
        const mainPoints= await getMainPoints(await readme.text());

        if(await isDuplicate(title,file.name,mainPoints)){
            console.log('already exists');
            return json({
                status:500
            })
        }

        try{
            mkdir(`static/media/${file.name}_${id}`,(err)=>{})
        }catch(e){
            console.log('folder exists');
        }
        try{
            const filename=`static/media/${file.name}_${id}/${file.name}_${date}.zip`
            const readme_path=`static/media/${file.name}_${id}/${file.name}_${readme.name}_${date}_readme.md`
            const license_path=`static/media/${file.name}_${id}/${file.name}_${license.name}_${date}_license.md`
            const image_path=`static/media/${file.name}_${id}/${image.name}`
            createWriteStream(filename).write(buffer);
            createWriteStream(image_path).write(new Uint8Array(await image.arrayBuffer()));
            createWriteStream(readme_path).write(await readme.text());
            createWriteStream(license_path).write(await license.text());
            
            const post={
                _id:`post_${id}`,
                user:user.key,          
                title:title,
                oneline:oneline,
                mainPoints:mainPoints,
                tags:tags,
                likes:0,
                downloads:0,
                hasImage:image.name!="noimage.png",
                date:date,
                dateAdded:(new Date()).toISOString(),
                ogFile:file.name,
                filename:[{
                    desc:`${fileDesc}`,
                    file:`${filename}`
                }],
                readme:`${readme_path}`,
                license:`${license_path}`,
                image:`${image_path}`
            }
            const like={
                _id:`like_${uuidv4()}`,
                post:`post_${id}`,
                ogUser:user.key,
                likeby:[],
            }
            const downloads={
                _id:`download_${uuidv4()}`,
                post:`post_${id}`,
                ogUser:user.key,
                downloadby:[],
            }

            let fail;

            postdb.put(post).then(doc=>console.log("document saved:",doc)).catch(err=>{
                fail=true;
                console.log(err)
            });
            postdb.put(like).then(doc=>console.log("document saved:",doc)).catch(err=>{
                fail=true;
                console.log(err)
            })
            postdb.put(downloads).then(doc=>console.log("document saved:",doc)).catch(err=>{
                fail=true;
                console.log(err)
            });
            
            if(!fail){
                return json({
                    status:200
                })
            }else{
                throw error;
            }

        }catch(e){
            console.log(e);
            return json({
                status:600
            })
        }
    }catch(err:any){
        console.error(err);
        return json({
            status:404
        })
    }
}