<script lang="ts">
	import { onMount } from "svelte";
    import Card from "../component/card.svelte";
	import type { CardType } from "./Data/cardpages/+server";
    let cards:CardType[]=[],pages:number=0,page=0,first:number,last:number,length:number;
    import { filter } from "../stores/filter";
    async function getCard(filter:any) {
        let response=await fetch('/Data/cardpages',{
            method:'POST',
            credentials:"include",
            headers: {
                "Content-Type": "application/json",
            },
            body:JSON.stringify({
                filter,
                $filter
            })
        });
        let data=await response.json();
        // console.log(data,page);
        cards=data.cards;
        length=data.length;
        pages=data.pages;
        first=data.first;
        last=data.last;
    }

    onMount(()=>{
        filter.subscribe(()=>getCard({page}));
    })

    function firstPage() {
        page=0;
        getCard({page});
    }
    function lastPage() {
        page=pages-1
        getCard({page});
    }

    function previous() {
        if(page>=0){
            page=page==0?0:page-1;
            getCard({page})
        }
    }

    function next() {
        if(pages>page){
            page=page==pages-1?page:page+1;
            getCard({page})
        }
    }

</script>
<section class="flex justify-center p-1 space-x-2 sticky bg-white w-full top-0 items-center">
    {#if length!=undefined&&cards.length!=0}
        <button on:click={firstPage}><img src="firstpage.svg" alt="firstpage" srcset="" width="24px" height="24px"></button>
        <button on:click={previous}><img src="previous.svg" alt="previous" srcset="" width="24px" height="16px"></button>
        <div class="text-xs lg:text-base">
            {first}-{last} of {length}
        </div>
        <button on:click={next}><img src="next.svg" alt="next" srcset="" width="24px" height="24px"></button>
        <button on:click={lastPage}><img src="lastpage.svg" alt="lastpage" srcset="" width="24px" height="24px"></button>
    {/if}
</section>

<section class="grid grid-cols-1 lg:grid-cols-4 relative">
    {#if cards.length!==0}
        {#each cards as card}
        <Card downloads={card.downloads} likes={card.likes} oneline={card.oneline} title={card.title} link={card.title} imageSrc={card.image}/>
        {/each}
    {:else}
        <div class="absolute left-[50%] -translate-x-[50%] text-center capitalize text-lg top-[180px]">
            Nothing to show here
        </div>
    {/if}
</section>

<style>
    button{
        border: 1px #aaa solid;
        background-color: #eee;
    }
    button:hover{
        background-color: #ddd;
    }
    button:active{
        background-color: #aaa;
    }
</style>