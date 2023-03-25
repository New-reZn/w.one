import { json } from '@sveltejs/kit';

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


let cards:CardType[]=[
    {
        title:'hello world',
        oneline:'this is line',
        image:'noimage.png',
        downloads:999999999999999,
        likes:999999999999999
    },
]

function createCopiesOfFirstIndex(numCopies: number): CardType[] {
    const copies: CardType[] = [];
    for (let i = 0; i < numCopies; i++) {
      copies.push(cards[0]);
    }
    return copies;
}

cards=createCopiesOfFirstIndex(126);

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
  
export async function POST({ request }) {
    const data:Data = await request.json();
    console.log(data);
    const a:CardType[][]=divideIntoPages(cards,20);
    return json({
        cards:a[data.filter.page],
        pages:Math.ceil(cards.length / 20),
        length:cards.length,
        first:data.filter.page*20+1,
        last:data.filter.page*20+a[data.filter.page].length
    });
}

export type {CardType};