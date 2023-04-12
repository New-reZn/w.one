import { postdb } from '../../stores/data.js';
import fs from 'fs/promises';

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
    filename: string[];
    readme: string;
    license: string;
    image: string;
}

async function read(filePath: string) {
    try {
      const data = await fs.readFile(filePath, 'utf-8');
      return data;
    } catch (error) {
      console.error(`Failed to read file ${filePath}: ${error}`);
      return null;
    }
  }
  
export async function load({params}:any){
      let data:any=await postdb.find({
        selector:{
          title:params.program
        }
      })
      let readme=await read(data.docs[0].readme);
      data=await postdb.find({
        selector:{
          title:params.program
        },
      })
      if(data.docs[0]!=undefined){
        const id=data.docs[0]._id;
        let docs=await postdb.find({
        selector:{
          post:id
        },
      })
      let download:any=docs.docs[0];
      let like:any=docs.docs[1]; 
      

    return {
        id:like._id,
        likes:like.likeby.length,
        downloads:download.downloadby.length,
        title:data.docs[0].title,
        image:data.docs[0].image.replace('static',''),
        readme
    };
  }
}