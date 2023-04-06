import { postdb } from '../../stores/data';


let tag:string[]=[];
postdb.allDocs({ include_docs: true }).then(result => {
result.rows.forEach(row => {
    tag.push(row.doc?.name);
});
}).catch(error => {
    console.log(error);
});

export function load({params}){
    return {tags:tag};
}

