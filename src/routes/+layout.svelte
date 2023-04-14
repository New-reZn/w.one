<script lang="ts">
    let tags:string[];
    let sortby='0';
    let date='';
    let titleOnly:boolean=false;
    let hasImage:boolean=true;
    let stext='';
	import { goto } from "$app/navigation";
	import "../app.css";
    import Tagselector from "../component/tagselector.svelte";
    import {filter} from '../stores/filter';
    import { v4 as uuidv4 } from 'uuid';
	import { onMount } from "svelte";
	import { registered } from "../stores/login";
    export let data;

    let name:string;
    let isloading=true;

    async function checkregister(register:any) {
        let respone=await fetch('/Data/checkRegister',{
            method:'POST',
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify(register)
        });
        if((await respone.json()).status==200){
            registered.set(true);
        }
        else{
            isloading=false;
        }
    }
  
    async function register(data:any) {
        
        localStorage.setItem('userId',JSON.stringify(data));
        console.log(localStorage.getItem('userId'))
        let respone=await fetch('/Data/register',{
            method:'POST',
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify(data)
        });
        if((await respone.json()).status===200){
            checkregister(data)
        }//else here
        else{alert('some problem occured please try again')};
    }

    onMount(()=>{
        let userId = localStorage.getItem('userId');
        if (userId!==null){
            let user=JSON.parse(userId);
            checkregister({key:user.key,name:user.name});
        }else{
            //console.log(here)
            isloading=false;
        }
    });

    async function doregister() {
        if(!(name==undefined||/^\s*$/.test(name.trim()))){
            let registerData={
                name:name,
                key:uuidv4(),
            }
            register(registerData);
        }
    }

    function apply(){
        console.log(titleOnly,hasImage)
        filter.set({
            searchText:stext,
            date,
            sortby,
            titleOnly,
            hasImage,
            tags
        })
        goto('/')
    }
</script>

<title>
    W.ONE
</title>



<header class="p-0.5 flex items-center justify-between space-x-3">
    <a href="/">
        <img src="../title.png" width="64px" alt="logo w.one" srcset="">
    </a>
    <div class="flex w-full">
        <input type="search" class="px-1 outline-none " placeholder="Search Item" id="searchtxt" bind:value={stext}>
        <button class="ml-1 px-0.5" on:click={apply}><img width="32px" src="../search.svg" alt="search button" srcset=""></button>
    </div>
    <a class="-translate-x-1 underline" href="/post">post</a>
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
        <Tagselector items={data.tags} bind:stack={tags}/>
        <label for="titlesearch" class="flex">
            <input type="checkbox" class="unwid mx-1" id="titlesearch" bind:checked={titleOnly}>
            <p class="w-full text-xs">title only</p>
        </label>
        <label for="imagesearch" class="flex">
            <input type="checkbox" class="unwid mx-1" id="imagesearch" bind:checked={hasImage}>
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

{#if !($registered)}    
    <div class="fixed grid items-center justify-center bg-white w-full h-full top-0 left-0">
        {#if isloading}
            Loading Please Wait ... 
        {:else}
            <div class="border-[1px] border-[#aaa] p-3 bg-[#eee] space-y-2">
                <input class="outline-none grid text-center" bind:value={name} placeholder="Please Enter Name" type="text">
                <input class="cursor-pointer bg-[#eee] hover:bg-[#ddd] active:bg-[#bbb]" on:click={doregister} type="submit" value="Submit">
            </div>
        {/if}
    </div>
{/if}

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