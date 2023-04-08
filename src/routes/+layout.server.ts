import { postdb } from "../stores/data";

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

export function load({params}:any){
    return {tags:tag};
}

