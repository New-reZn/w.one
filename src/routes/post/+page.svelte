<script lang="ts">
	import { listen } from "svelte/internal";
    import Tagselector from "../../component/tagselector.svelte";
	import { registered } from "../../stores/login";
    import JSZip from "jszip";
    let fileInput:HTMLInputElement;
    let title:string;
    let tags:string[];
    let image:HTMLInputElement;
    let readme:HTMLInputElement;
    let license:HTMLInputElement;
    export let data;
    const postData=new FormData();
    let prop={
        webkitdirectory: true
    }

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
    

    let oneline:string[]=[];
    function readmeFunction(){
        if(readme.files!=(undefined||null)){
            const readmereader=new FileReader();
            readmereader.readAsText(readme.files[0]);
            readmereader.onload = (event) => {
                const contents = (event.target?.result)?.toString();
                if(contents!=undefined && readme.files!=(undefined||null)){
                    postData.append("oneline",contents.replace(/[\n,\r\t]/g, ' ').split(" ").slice(0,10).toString().replace(/,/g, ' '));
                    postData.append("readme",readme.files[0],readme.files[0].name)

                }
                else{
                    console.log("readme error content empty")
                }
            }
        }else{
            console.log("readme error")
        }
    }

    function getFileInputFolder(fileInput:HTMLInputElement) {
        const files = fileInput.files;
        if (files) {
            const firstFile = files[0];
            const folderPath = firstFile.webkitRelativePath.split("/").slice(0, -1).join("/");
            return folderPath;
        }
        return title;
    }



    async function upload(){
        let user=localStorage.getItem('userId');
        const xhr = new XMLHttpRequest();
        console.log('here')

        if(user==null){
            registered.set(false);
            return;
        }else{
            postData.append("user",user)
        }

        if(!(title==undefined||/^\s*$/.test(title.trim()))){
            postData.append("title",title);
            postData.append("date",Date.now().toString());
        }else{
            console.log("title error")
            return;
        }

        if(tags.length!=0){
            postData.append("tags",JSON.stringify({tags:tags}));
        }
        else{
            console.log('tag error')
            return;
        }

        if(image.files!=(undefined||null)){
            postData.append("image",image.files[0],image.files[0].name);
        }else{
            console.log("image error")
            return;
        }
        
        if(license.files!=(undefined||null)){
            postData.append("license",license.files[0],license.files[0].name)
        }else{
            console.log("license error")
            return;
        }

        //file handles here
        if(fileInput.files!=(undefined||null)){
            let zip = await zipDirectory(fileInput.files);
            postData.append("files",zip,getFileInputFolder(fileInput));
            xhr.upload.addEventListener('progress', (event) => {
                const progress = (event.loaded / event.total) * 100;
                console.log(`Upload Progress: ${progress}%`);
            });
        }else{
            console.log("folder error")
            return;
        }

        if(postData.get('oneline')==(undefined||null||'')){
            console.log('readme error')
            return;
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
        <input on:change={previewImage} bind:this={image} accept=".jpg, .jpeg, .png, .gif" type="file" id='imageInput'>
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
                <img src="upload.svg" alt="upload readme here" srcset="" >
                Upload Readme.md
            </div>
        </label>
        <label for="license" class="borD bg-white hover:bg-[#bbb] active:bg-[#aaa]bg-white p-10 text-center cursor-pointer">
            <div class="flex flex-col items-center justify-center text-xs">
                <img src="upload.svg" alt="upload license here" srcset="">
                Upload License
            </div>
        </label>
        <label for="fileInput" class="borD bg-white hover:bg-[#bbb] active:bg-[#aaa] p-10 text-center  cursor-pointer">
            <div class="flex flex-col items-center justify-center text-xs">
                <img src="uploadFolder.svg" alt="upload folder here" srcset="">
                Upload Folder
            </div>
        </label>
        <input type="file" bind:this={readme} on:change={readmeFunction} id="readme" accept=".md, .txt">
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