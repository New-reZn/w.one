import { writable, type Writable } from "svelte/store";

interface Filter{
    sortby:string,
    date:string,
    tags:string[],
    titleOnly:boolean,
    hasImage:boolean,
    searchText:string
}

export const filter:Writable<Filter>=writable<Filter>({
    searchText:'',
    date:new Date().toDateString(),
    sortby:'0',
    titleOnly:true,
    hasImage:true,
    tags:[]
});
export type {Filter};