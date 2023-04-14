import { json } from '@sveltejs/kit';
import { postdb } from '../../../stores/data.js';
import Tags from '../../../component/tags.svelte';

interface CardType {
    title: string;
    oneline: string;
    image: string;
    downloads: number;
    likes: number;
}
interface Post extends CardType{
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

function Pointsearch(searchPoints:string[],cards:Post[]) {
  return cards.filter(card =>
    card.mainPoints.some(mainPoint =>
      searchPoints.includes(mainPoint)
    )
  );
}

function titlesearch(title:string,cards:Post[]) {
  return cards.filter(card => {
    return card.title.toLowerCase().trim()===title.toLowerCase().trim()
  });
}

function hasImage(cards:Post[]) {
  return cards.filter(card => card.hasImage);
}

function datesearch(date:string,cards:Post[]) {

  return cards.filter(card => {

    const cardDate = new Date(card.dateAdded);
    const searchDateObj = new Date(date);
    
    return cardDate <= searchDateObj;
  });
}

function tagsearch(tags:string[],cards:Post[]) {
  return  cards.filter(card => {
    return card.tags.some(tag => tags.includes(tag));
  });   
}

function compareDates(a: Post, b: Post) {
  const dateA = new Date(a.dateAdded);
  const dateB = new Date(b.dateAdded);
  return dateA.getTime() - dateB.getTime();
}

function newsort(cards:Post[]) {
  return cards.sort(compareDates).reverse();
}

function oldsort(cards:Post[]) {
  return cards.sort(compareDates);
}
function likesort(cards:Post[]) {
  return cards.sort((a, b) => a.likes - b.likes);
}
function dowloadsort(cards:Post[]) {
  return cards.sort((a, b) => a.downloads - b.downloads);
}

const sortTypes=[
  newsort,
  oldsort,
  likesort,
  dowloadsort
]

interface Data{
    filter:{
        page:number
    }
}

let cards:Post[]=[]

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
    // @ts-ignore
    let filter=data.$filter

    let newCards=cards;
    if(filter.tags.length!=0){
      newCards=tagsearch(filter.tags,newCards)
    }

    if (filter.searchText!=='') {
      if (filter.titleOnly) {
        newCards=titlesearch(filter.searchText,newCards)
      }else{
        let point=Pointsearch(filter.searchText.split(' '),newCards)
        let title=titlesearch(filter.searchText,newCards);
        newCards = point.concat(title)
      }
    }
    if (filter.hasImage) {
      newCards=hasImage(newCards)
    }
    if(filter.date!==''){
      newCards = datesearch(filter.date,newCards)
    }else{
      newCards = datesearch((new Date).toDateString(),newCards)
    }
    newCards=sortTypes[filter.sortby as number](newCards)
    
    const a:CardType[][]=divideIntoPages(newCards,20);
    return json({
        cards:a[data.filter.page],
        pages:Math.ceil(cards.length / 20),
        length:cards.length,
        first:data.filter.page*20!=0?data.filter.page*20+1:0,
        last:data.filter.page*20+a[data.filter.page].length
    });
}

export type {CardType};