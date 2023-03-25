<script lang="ts">
	import "../app.css";
    import Tagselector from "../component/tagselector.svelte";
    import {filter} from '../stores/filter';
    let tags:string[];
    let sortby='0';
    let date='';
    let titleOnly=true;
    let hasImage=true;
    let stext='';
    function apply(){
        filter.set({
            searchText:stext,
            date,
            sortby,
            titleOnly,
            hasImage,
            tags
        })
    }
</script>

<title>
    W.ONE
</title>

<header class="p-0.5 flex items-center justify-between space-x-3">
    <img src="title.png" width="64px" alt="logo w.one" srcset="">
    <div class="flex w-full">
        <input type="search" class="px-1 outline-none " placeholder="Search Item" id="searchtxt" bind:value={stext}>
        <button class="ml-1 px-0.5" on:click={apply}><img width="32px" src="search.svg" alt="search button" srcset=""></button>
    </div>
</header>

<div class="flex w-full justify-between">
    <section class="text-sm capitalize p-1 overflow-auto lg:w-[10.3%] w-[20.3%] space-y-2" style="background: #eee;">
        <p class="text-blue-700 text-lg mb-1">filters</p>
        <select placeholder="sort by" bind:value={sortby}>
            <option value="0">newest</option>
            <option value="1">oldest</option>
            <option value="2">most loved</option>
            <option value="3">most downloaded</option>
        </select>
        <input type="date" bind:value={date}>
        <Tagselector items={['a','b','c']} bind:stack={tags}/>
        <label for="titlesearch" class="flex">
            <input type="checkbox" class="unwid mx-1" id="titlesearch" bind:value={titleOnly} checked>
            <p class="w-full text-xs">title only</p>
        </label>
        <label for="imagesearch" class="flex">
            <input type="checkbox" class="unwid mx-1" name="" id="imagesearch" bind:value={hasImage} checked>
            <p class="w-full text-xs">has image</p>
        </label>
        <button class="p-1 float-right" on:click={apply}>apply?</button>
    </section>
    <section class="flex-1 overflow-auto">
        <slot/>
    </section>
    <section class="text-sm capitalize overflow-y-scroll p-1 lg:w-[10.3%] w-[20.3%]">
        <p class="relative top-0">News</p>
    </section>
</div>
<footer class="flex justify-center space-x-2 inset-x-0 bottom-0 text-xs">
    <p>©️ 2023 w.one</p>
    <a href="/">help</a>
    <a href="/">terms</a>
    <a href="/">feedback</a>
    <a href="/">about</a>
</footer>

<style>
    header{
        background: #eee;
        border-bottom: 1px #ccc solid;
    }
    footer{
        background: #eee;
        border-top: 1px #ccc solid;
    }
    section{
        border-left: 1px #ccc solid;
        border-right: 1px #ccc solid;
    }
    input,select{
        padding: 2px;
        border: 1px #ccc solid;
        width:100%;
    }

    .unwid{
        width: fit-content;
    }

    button{
        background-color: #eee;
        border: 1px #aaa solid; 
    }
    button:hover{
        background-color: #ddd;
    }
    button:active{
        transform: translateY(2%);
        outline: 1px black solid;
    }

    .flex-1 {
    height: calc(100vh - 2 * 1rem - 2 * 1px - 1.25rem);
  }
</style>