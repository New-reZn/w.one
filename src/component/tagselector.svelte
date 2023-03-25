<script lang="ts">
    import { writable } from 'svelte/store';
    import Tags from "./tags.svelte";
    
    let text:String;
    export let items: String[];
    export let stack:String[]=[];
    function add() {
        if(text=="" || stack.includes(text))return;
        stack.push(text);
        stack=stack;
    }
    function remove(text: String) {
        const index = stack.indexOf(text);
        if (index > -1) {
            stack.splice(index, 1);
        }
        stack=stack;
    }

</script>

<ul class="p-1 my-1 w-full">
    <input bind:value={text} type="text" class="p-1 mb-1 w-full" placeholder="Enter tags" list="items" on:change={add}/>
    <datalist id="items">
        {#each items as item (item)}
            <option value="{item}"></option>
        {/each}
    </datalist>

    {#each stack as stackItem}
        <Tags text={stackItem} on:close={() => remove(stackItem)}/>
    {/each}

</ul>


<style>
ul{
    border: 1px #aaa solid;
}
</style>
