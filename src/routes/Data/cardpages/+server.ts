import { json } from '@sveltejs/kit';
import { postdb } from '../../../stores/data.js';

interface CardType {
    title: string;
    oneline: string;
    image: string;
    downloads: number;
    likes: number;
}
interface Data{
    filter:{
        page:number
    }
}

let cards:CardType[]=[]

async function getAllpost() {
  const mapFunction = function(doc:any) {
    if (doc._id.startsWith('post_')) {
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

await getAllpost().then(result=>{
  result.forEach(data=>{
    // console.log(data)
    cards.push(data)
  })
})

function divideIntoPages(array: CardType[], pageSize: number): CardType[][] {
    if (pageSize <= 0) {
      throw new Error('Page size should be a positive integer');
    }
    if (array.length <= pageSize) {
      return [array];
    }
    const numPages = Math.ceil(array.length / pageSize);
    const pages = [];
    for (let i = 0; i < numPages; i++) {
      const start = i * pageSize;
      const end = Math.min(start + pageSize, array.length);
      pages.push(array.slice(start, end));
    }
    return pages;
}
  
export async function POST({ request }:any) {
    const data:Data = await request.json();
    // console.log(data);
    const a:CardType[][]=divideIntoPages(cards,20);
    return json({
        cards:a[data.filter.page],
        pages:Math.ceil(cards.length / 20),
        length:cards.length,
        first:data.filter.page*20!=0?data.filter.page*20+1:0,
        last:data.filter.page*20+a[data.filter.page].length
    });
}

export type {CardType};