<script lang="ts">
    import { onMount } from 'svelte';
    import { pageindex } from '../../../stores/prog';
	import { json } from '@sveltejs/kit';
	import { dataset_dev } from 'svelte/internal';
    let uploader=false;
    let props={
        webkitdirectory:true,
        multiple:true
    }

    export let data;
    onMount(async ()=>{
        const sending={
            user:JSON.parse(localStorage.getItem('userId')),
            post:data.post_digest
        }
        pageindex.set([false,true,false,false])       
        let response=await fetch('/Data/checkposter',{
            method:'POST',
            credentials:"include",
            headers: {
                "Content-Type": "application/json",
            },
            body:JSON.stringify(sending)
        });
        uploader=await response.json();
    })


</script>

{#if uploader}
<div class=" w-fit">
    <label class="hover:bg-[#eee] cursor-pointer active:bg-[#bbb] p-2 m-2 border-[1px] border-[#aaa] flex flex-col items-center justify-center" for="unv">
        <img src="../uploadFolder.svg" alt="Upload files icon" srcset="">
        Upload New Version
        <input type="file" id="unv" {...props} class="hidden">
    </label>
</div>
{/if}

<table class="m-2">
    <tr>
        <th>
            version
        </th>
        <th>
            downloads
        </th>
    </tr>
    <tr>
        <td>
            version 0.0.1:
        </td>
        <td>
            <a href="/">click here</a>
        </td>
    </tr>
</table>


<style>
    table, th, td {
        border: 1px solid black;
        padding: 0.25rem;
    }
    tr>td{
        width: 100%;
    }
    tr>th{
        background-color: #eee;
    }
</style>