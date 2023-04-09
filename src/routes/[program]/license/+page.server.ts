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

export async function load({params}){
    const program=params.program;
    let data=await postdb.find<Promise<Post>>({
        selector:{title:params.program}
    })
    let license=await read(data.docs[0].license);
    return {
        title:data.docs[0].title,
        license
    };
}

