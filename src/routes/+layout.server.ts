import { postdb,newsdb } from "../stores/data";
import { v4 as uuidv4 } from 'uuid';

let tag:string[]=[];


async function getAllTags() {
    const mapFunction = function(doc:any) {
      if (doc._id.startsWith('tag_')) {
        // @ts-ignore
        emit(doc._id, doc);
      }
    };
    const result = await postdb.query(mapFunction,{
        include_docs: true,
        reduce: false
    });
    const tags = result.rows.map(row => row.value);
    return tags;
}

await getAllTags().then(result=>{
    result.forEach(data=>{
        tag.push(data.name)
    })
})

const mapFunction = function(doc:any) {
    if (doc._id.startsWith('post_')) {
      // @ts-ignore
      emit(doc._id, doc);
    }
};

export async function load({params}:any){
  let news:any[]=[];
  let docs=await newsdb.allDocs({include_docs: true});
  docs.rows.forEach(row=>{
    news.push({
      // @ts-ignore
      title:row.doc.title,
      // @ts-ignore
      date:row.doc.date
    })
  })
  return {tags:tag,news};
}