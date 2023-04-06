<script lang="ts">
    import Tagselector from "../../component/tagselector.svelte";
	import { registered } from "../../stores/login";
    let fileInput:HTMLInputElement;
    let title:string;
    let tags:string[];
    let image:HTMLInputElement;
    let readme:HTMLInputElement;
    let license:HTMLInputElement;
    export let data;
    let prop={
        webkitdirectory: true
    }

    async function upload(){
        let user=localStorage.getItem('userId');
        let date:Date=new Date();
        const xhr = new XMLHttpRequest();
        const postData=new FormData();
        
        if(user==null){
            registered.set(false);
        }else{
            postData.append("user",user)
        }

        if(!(title==undefined||/^\s*$/.test(title.trim()))){
            postData.append("title",title);
            postData.append("date",date.toDateString());
        }else{
            console.log("title error")
        }

        if(tags.length!=0){
            postData.append("tags",JSON.stringify({tags:tags}));
        }

        if(image.files!=undefined){
            postData.append("image",image.files[0])
        }else{
            console.log("image error")
        }
        
        if(readme.files!=undefined){
            const readmereader=new FileReader();
            readmereader.readAsText(readme.files[0]);
             readmereader.onload = (event) => {
                 const contents = (event.target?.result)?.toString();
                 if(!(contents==undefined||contents=="")&&readme.files!=undefined){
                    postData.append("oneline",contents.split(" ").slice(0,10).toString());
                    postData.append("readme",readme.files[0])
                }
                else{
                    console.log("readme error content empty")
                }
            };
        }else{
            console.log("readme error")
        }
        if(license.files!=undefined){
            const licenseReader=new FileReader();
            licenseReader.readAsText(license.files[0]);
            licenseReader.onload = (event) => {
                 const contents = event.target?.result;
                if(!(contents==undefined||contents=="") && license.files!=undefined){
                    postData.append("license",license.files[0])
                }else{
                    console.log("license error content empty")
                }
            };
        }else{
            console.log("license error")
        }

        if(fileInput.files!=null){
            for (let i of fileInput.files) {
                postData.append('folder', i)
            }
            xhr.upload.addEventListener('progress', (event) => {
            const progress = (event.loaded / event.total) * 100;
            console.log(`Upload Progress: ${progress}%`);
            });
        }else{
            console.log("folder error")
        }
        console.log(postData);
        xhr.open('POST', 'Data/post');
        xhr.send(postData);
    }

    function previewImage(event:Event) {
        event.preventDefault();
        const imageInput = document.getElementById('imageInput') as HTMLInputElement;
        const imagePreview = document.getElementById('imagePreview') as HTMLImageElement;
        const file = imageInput.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function () {
                imagePreview.src = reader.result as string;
            };
            reader.readAsDataURL(file);
        } else {
            console.log("No file selected.");
        }
    }
</script>

<section class="m-1 p-0.5 bg-[#eee] grid self-center">
    <div class="grid bor grid-cols-2">
        <input on:change={previewImage} bind:this={image} type="file" id='imageInput'>
        <label for="imageInput" class="bg-white hover:bg-[#bbb] active:bg-[#aaa] m-1 borD flex items-center justify-center cursor-pointer ">
            <img src="../noimage.png" id="imagePreview" alt="" height="256px" width="256px">
        </label>
        <div class="m-1 flex flex-col items-center justify-center space-y-3">
            <label for="title" class="self-start">Enter Title:</label>
            <input type="text" id="title" bind:value={title} placeholder="title" class="w-full outline-none p-1">
            <label for="title" class="self-start">Enter Tags:</label>
            <Tagselector items={data.tags} bind:stack={tags}/>
        </div>
    </div>
    <div class="m-2 grid grid-cols-3 space-x-1 items-center justify-center">
        <label for="readme" class="  flex borD bg-white hover:bg-[#bbb] active:bg-[#aaa] justify-center cursor-pointer p-10">
            <div class="flex flex-col items-center justify-center text-xs">
                <img src="upload.svg" alt="" srcset="">
                Upload Readme.md
            </div>
        </label>
        <label for="license" class="borD bg-white hover:bg-[#bbb] active:bg-[#aaa]bg-white p-10 text-center cursor-pointer">
            <div class="flex flex-col items-center justify-center text-xs">
                <img src="upload.svg" alt="" srcset="">
                Upload License
            </div>
        </label>
        <label for="fileInput" class="borD bg-white hover:bg-[#bbb] active:bg-[#aaa] p-10 text-center  cursor-pointer">
            <div class="flex flex-col items-center justify-center text-xs">
                <img src="uploadFolder.svg" alt="" srcset="">
                Upload Files
            </div>
        </label>
        <input type="file" bind:this={readme} id="readme" accept=".md, .txt">
        <input type="file" bind:this={license} id="license" accept=".md, .txt">
        <input type="file" id="fileInput" {...prop} multiple bind:this={fileInput}>
    </div>
    <input class="bor p-2 cursor-pointer hover:bg-[#aaa] active:bg-[#999] " type="submit" value="Upload" on:click={upload}>
</section>

<style>
    section{
        border: 1px #bbb solid;
    }

    input[type="file"]{
        display: none;
    }

    .bor{
        margin: 0.25rem;
        border-width: 1px;
        border-style: solid;
        Border-color: #888;
    }
    .borD{
        margin: 0.25rem;
        border-width: 3px;
        border-style: double;
        Border-color: #888;
    }
</style>