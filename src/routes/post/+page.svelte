<script lang="ts">
    import Tagselector from "../../component/tagselector.svelte";
    let i:String[]=[];
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
        <input on:change={previewImage} type="file" id='imageInput'>
        <label for="imageInput" class="bg-white hover:bg-[#bbb] active:bg-[#aaa] m-1 borD flex items-center justify-center cursor-pointer ">
            <img src="../noimage.png" id="imagePreview" alt="" height="256px" width="256px">
        </label>
        <div class="m-1 flex flex-col items-center justify-center space-y-3">
            <label for="title" class="self-start">Enter Title:</label>
            <input type="text" id="title" placeholder="title" class="w-full outline-none p-1">
            <label for="title" class="self-start">Enter Tags:</label>
            <Tagselector items={['a','b','c']} bind:stack={i}/>
        </div>
    </div>
    <div class="m-2 grid grid-cols-3 space-x-1 items-center justify-center">
        <label for="readme" class="  flex borD bg-white hover:bg-[#bbb] active:bg-[#aaa] justify-center cursor-pointer p-10">
            <div class="flex flex-col items-center justify-center text-xs">
                <img src="upload.svg" alt="" srcset="">
                Upload Readme.md
            </div>
        </label>
        <label for="readme" class="borD bg-white hover:bg-[#bbb] active:bg-[#aaa]bg-white p-10 text-center cursor-pointer">
            <div class="flex flex-col items-center justify-center text-xs">
                <img src="upload.svg" alt="" srcset="">
                Upload License
            </div>
        </label>
        <label for="readme" class="borD bg-white hover:bg-[#bbb] active:bg-[#aaa] p-10 text-center  cursor-pointer">
            <div class="flex flex-col items-center justify-center text-xs">
                <img src="uploadFolder.svg" alt="" srcset="">
                Upload Files
            </div>
        </label>
        <input type="file" id="readme">
        <input type="file" id="license">
        <input type="file" id="files">
    </div>
    <input class="bor p-2 cursor-pointer hover:bg-[#aaa] active:bg-[#999] " type="submit" value="Upload">
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