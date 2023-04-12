import { postdb } from '../../../stores/data.js';
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
  filename: {
      desc:string,
      file:string
  }[];
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
        },
    })
    const id:Post=data.docs[0]._id;
        let docs=await postdb.find({
            selector:{
              post:id
            },
        })

    let download:any=docs.docs[0];

    return {
      id:download._id,
      post_digest:data.docs[0]._id,
      files:data.docs[0].filename,
      title:data.docs[0].title
    };
}