<script lang="ts">
    import { createEventDispatcher } from 'svelte';
    const dispatch = createEventDispatcher();
    let text:String;
    export{text};
</script>


<div class="p-1 py-0.5 my-0.5 flex items-center">
    <p class="flex-grow">{text}</p>
    <button on:click={()=>dispatch('close',{text:text})}>
        <img src="close.svg" alt="cleartag" width="16px">
    </button>
</div>

<style>
    div{
    cursor: pointer;
    border: 1px #aaa solid;
    }
    button:hover{
        background-color: #bbb;
    }
    button:active{
        background-color: #aaa;
    }
</style>