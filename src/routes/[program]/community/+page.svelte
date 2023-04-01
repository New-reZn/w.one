<script lang="ts">
    import { onMount } from 'svelte';
    import { pageindex } from '../../../stores/prog';
    import Comment from '../../../component/comment.svelte';
    onMount(()=>{
        pageindex.set([false,false,false,true])
    })
    // export let data;
</script>

<section class="p-2">
    <div class="grid grid-cols-2">
        <div class="flex items-center space-x-1">
            <div class="flex w-fit cursor-pointer hover:bg-[#eee] m-2 p-1 border-2 border-[#bbb]">
                <p>Likes :</p>
                <p>1221</p>
                <img src="../like.svg" alt="like icon" srcset="" width="24px" height="16px">
            </div>
        </div>
        <div class="flex items-center space-x-1">
            <p>Downloads :</p>
            <p>1222111</p>
            <img src="../downloads.svg" alt="download icon" srcset="" width="24px" height="16px">
        </div>
        <div class="col-span-2 flex">
            <input type="text" placeholder="1 comment remain" class="w-full p-1 outline-none" >
            <input type="submit" value="Comment" class="p-1">
        </div>
    </div>

    <div>
        <Comment comment="hey "/>
    </div>

    

</section>

<style>
    input{
        border:1px #aaa solid;
    }
    input[type="submit"]{
        background-color: #eee;
        cursor: pointer;
    }
    input[type="submit"]:hover{
        background-color: #ddd;
    }
    input[type="submit"]:active{
        background-color: #bbb;
    }
</style>