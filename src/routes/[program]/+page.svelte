<script>
    import { onMount } from 'svelte';
    import { pageindex } from '../../stores/prog';
    import showdown from 'showdown';
    export let data;
	import { registered } from '../../stores/login';
    
    let disabled=false

    async function incrementLike() {
        let user=localStorage.getItem("userId");
        if(user!=null){
            let response=await fetch('/Data/inLike',{
                method:'POSt',
                headers:{
                    'Content-Type':'application/json'
                },
                body:JSON.stringify({
                    user,
                    id:data.id,
                    stat:data.title
                })
            })
            let result=await response.json();
            if(result.status===500){
                console.log('exist error');
                return;
            }else if(result.status===200){
                disabled=true;
                data.likes=data.likes+1;
                return;
            }
        }else{
            registered.set(false);
        }
    }
    onMount(async ()=>{
        pageindex.set([true,false,false]);let user=localStorage.getItem("userId");
        if(user!=null){
            let response=await fetch('/Data/checklike',{
                method:'POSt',
                headers:{
                    'Content-Type':'application/json'
                },
                body:JSON.stringify({
                    user,
                    id:data.id
                })
            })
            let result=await response.json();
            if(result.status==500){
                disabled=true;
                return;
            }            
        }else{
            registered.set(false);
        }
    })
    const converter=new showdown.Converter();
    const markdown=converter.makeHtml(data.readme==null?'':data.readme);
</script>
<p class="text-center capitalize text-lg mt-1 underline">{data.title}</p>
<div class="flex justify-center p-2">
    <img class="img" src={data.image} alt="" height="300px" width="300px" srcset="">
</div>

<section class="p-2">
    <div class="grid grid-cols-2 bg-[#eee] border-[1px] border-[#ccc]">
        <div class="flex flex-col justify-start space-x-1">
            {#key disabled}
            <button class="flex active:bg-pink-400 disabled:bg-pink-400 items-center w-fit cursor-pointer hover:bg-[#eee] m-2 p-1 border-2 border-[#bbb]" disabled='{disabled}' on:click={incrementLike}>
                <p>Likes:&nbsp;</p>
                <p>{data.likes}</p>
                <img src="../like.svg" alt="like icon"   srcset="" width="24px" height="16px">
            </button>
            <p class="pb-2 text-xs">*Likes are permanent</p>
            {/key}
        </div>
        <div class="flex items-center space-x-1">
            <p>Downloads:&nbsp;</p>
            <p>{data.downloads}</p>
            <img src="../downloads.svg" alt="download icon" srcset="" width="24px" height="16px">
        </div>
        <p class="p-2 pb-1">Readme:</p>
    </div>
    {@html markdown}
</section>

<style>
    .img{
        border: 2px #bbb solid;
    }
</style>