<script lang="ts">
    import { onMount } from 'svelte';
    import { pageindex } from '../../../stores/prog';
	import { json } from '@sveltejs/kit';
	import { dataset_dev } from 'svelte/internal';
    import { registered } from '../../../stores/login';
    import JSZip from "jszip";
    let uploader=false;
    let props={
        webkitdirectory:true,
        multiple:true
    }
    let Desc:string;
    let upload:HTMLInputElement;
    
    async function readFile(file:File):Promise<any> {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsArrayBuffer(file);
        });
    }

    async function zipDirectory(files:FileList) {
        const zip = new JSZip();

        for (const file of files) {
            if (file.webkitRelativePath.includes('/')) { // if file is inside a directory
                const directories = file.webkitRelativePath.split('/');
                const fileName = directories.pop();
                const subFolder = zip.folder(directories.join('/'));
                subFolder?.file(fileName!=undefined?fileName:'file', await readFile(file));
            } else {
                zip.file(file.name, await readFile(file));
            }
        }

        const zipContent = await zip.generateAsync({ type: "blob" });
        return zipContent;
    }
    
    function getFileInputFolder(fileInput:HTMLInputElement) {
        const files = fileInput.files;
        if (files) {
            const firstFile = files[0];
            const folderPath = firstFile.webkitRelativePath.split("/").slice(0, -1).join("/");
            return folderPath;
        }
    }

    async function uploadVer(){
        const user=localStorage.getItem('userId');
        const VerData=new FormData();
        const xhr = new XMLHttpRequest();
        if(!(Desc==undefined||/^\s*$/.test(Desc.trim()))){
            VerData.append("date",Date.now().toString());
            VerData.append("filedesc",Desc);
        }else{
            console.log("fileDesc error")
            return;
        }
        if(upload.files!=(undefined||null)){
            let zip = await zipDirectory(upload.files);
            VerData.append("files",zip,getFileInputFolder(upload));
            xhr.upload.addEventListener('progress', (event) => {
                const progress = (event.loaded / event.total) * 100;
                console.log(`Upload Progress: ${progress}%`);
            });
        }else{
            console.log("folder error")
            return;
        }
        //user id ,post id
        if(user==null){
            registered.set(false);
            return;
        }else{
            VerData.append("user",user)
        }
        if(data.post_digest!=null){
            VerData.append("post",data.post_digest)
        }else{
            console.log(''); 
            return;
        }
        console.log(VerData);
        xhr.open('POST', '../Data/uploadVer');
        xhr.send(VerData);
        //check for success

    }

    export let data;
    onMount(async ()=>{
        let user=localStorage.getItem('userId')
        if(user==null){
            registered.set(false);
            return;
        }
        const sending={
            user:JSON.parse(user),
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
    const files=data.files;
    // console.log(data)
</script>

{#if uploader}
<div class="flex flex-col space-y-1">
    <div class="flex mt-2 space-x-1 justify-center">
        <label class="hover:bg-[#eee] cursor-pointer active:bg-[#bbb] p-2 border-[1px] border-[#aaa] flex flex-col items-center justify-center" for="unv">
            <img src="../uploadFolder.svg" alt="Upload files icon" srcset="">
            Upload New Version
            <input type="file" id="unv" bind:this={upload} {...props} class="hidden">
        </label>
        <textarea bind:value={Desc} placeholder="write about new version here" class="p-1 border-[1px] border-[#aaa] resize-none w-4/5" name="" id=""></textarea>
    </div>
    <button on:click={uploadVer} class="mx-3 bor p-2 cursor-pointer hover:bg-[#aaa] bg-[#eee] active:bg-[#999] m-1 border-[1px] border-[#888]">Upload</button>
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
    {#each files as file}
        <tr>
            <td>{file.desc}</td>
            <td><a href="{file.file.replace('static','')}">click here</a></td>
        </tr>    
    {/each}
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
    a{
        cursor: pointer;
    }
</style>