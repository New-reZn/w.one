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
    let filedesc:string;
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
                    alert("readme error content empty")
                }
            }
        }else{
            alert("readme error")
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
        const user=localStorage.getItem('userId');
        const xhr = new XMLHttpRequest();

        if(user==null){
            alert('register before doing any subtantial task!!');
            registered.set(false);
            return;
        }else{
            postData.append("user",user)
        }

        if(!(title==undefined||/^\s*$/.test(title.trim()))){
            postData.append("title",title);
            postData.append("date",Date.now().toString());
        }else{
            alert("title error")
            return;
        }

        if(!(filedesc==undefined||/^\s*$/.test(filedesc.trim()))){
            postData.append("filedesc",filedesc);
        }else{
            alert("fileDesc error")
            return;
        }

        if(tags.length!=0){
            postData.append("tags",JSON.stringify({tags:tags}));
        }
        else{
            alert('tag error')
            return;
        }

        if(image.files!=(undefined||null)){
            postData.append("image",image.files[0],image.files[0].name);
        }else{
            alert("image error")
            return;
        }
        
        if(license.files!=(undefined||null)){
            postData.append("license",license.files[0],license.files[0].name)
        }else{
            alert("license error")
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
            alert("folder error")
            return;
        }

        if(postData.get('oneline')==(undefined||null||'')){
            alert('readme error')
            return;
        }

        xhr.open('POST', 'Data/post');
        xhr.send(postData);
        xhr.onload = function() {
        if (xhr.status === 200) {
            let response=JSON.parse(xhr.responseText);
            if(response.status==600){
                alert('error occured while saving');
                return;
            }
            if(response.status==500){
                alert('folder already exist');
                return;
            }
            if(response.status==200){
                alert('succesfully uploaded the new version , reload to see uploaded file');
                return;
            }
            if(response.status==404){
                alert('something went wrong,please try again');
                return;
            }
            } else {
                alert('Upload failed.');
            }
        };
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
            alert("No file selected.");
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
            <label for="filedesc" class="self-start">Enter Folder Description:</label>
            <input type="text" id="filedesc" bind:value={filedesc} placeholder="Write about folder" class="w-full outline-none p-1">
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
    <input class="bor p-2 cursor-pointer hover:bg-[#aaa] active:bg-[#999]" type="submit" value="Upload" on:click={upload}>
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